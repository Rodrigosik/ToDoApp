import { inject, Injectable } from '@angular/core';
import { ColumnService } from '../column/column.service';
import { StorageService } from '../storage/storage.service';
import { SyncService } from '../sync/sync.service';
import { TaskModel } from './task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly columnService = inject(ColumnService);
  private readonly storage = inject(StorageService);
  private readonly sync = inject(SyncService);

  /**
   * Agrega una nueva tarea a una columna
   */
  addTask(columnId: string, task: Omit<TaskModel, 'id' | 'columnId'>): void {
    const newTask: TaskModel = {
      ...task,
      id: crypto.randomUUID(),
      columnId,
    };

    // Buscar la columna y agregar la tarea
    this.columnService.columnsSignal.update(columns =>
      columns.map(col => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: [...col.tasks, newTask],
          };
        }
        return col;
      })
    );

    // Persistir y sincronizar
    this.saveAndSync();

    console.log('Tarea agregada:', newTask.title, 'a columna:', columnId);
  }

  /**
   * Actualiza una tarea existente
   */
  updateTask(taskId: string, updates: Partial<TaskModel>): void {
    this.columnService.columnsSignal.update(columns =>
      columns.map(col => ({
        ...col,
        tasks: col.tasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        ),
      }))
    );

    this.saveAndSync();

    console.log('Tarea actualizada:', taskId);
  }

  /**
   * Mueve una tarea de una columna a otra
   */
  moveTask(taskId: string, targetColumnId: string): void {
    let taskToMove: TaskModel | null = null;
    let sourceColumnId: string | null = null;

    // Encontrar la tarea
    for (const column of this.columnService.columns()) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) {
        taskToMove = task;
        sourceColumnId = column.id;
        break;
      }
    }

    if (!taskToMove || !sourceColumnId || sourceColumnId === targetColumnId) {
      return; // No hacer nada si no se encuentra o es la misma columna
    }

    // Remover de columna origen y agregar a columna destino
    this.columnService.columnsSignal.update(columns =>
      columns.map(col => {
        // Remover de columna origen
        if (col.id === sourceColumnId) {
          return {
            ...col,
            tasks: col.tasks.filter(t => t.id !== taskId),
          };
        }
        // Agregar a columna destino
        if (col.id === targetColumnId) {
          return {
            ...col,
            tasks: [...col.tasks, { ...taskToMove!, columnId: targetColumnId }],
          };
        }
        return col;
      })
    );

    this.saveAndSync();

    console.log('Tarea movida:', taskId, 'a columna:', targetColumnId);
  }

  /**
   * Elimina una tarea
   */
  deleteTask(taskId: string): void {
    this.columnService.columnsSignal.update(columns =>
      columns.map(col => ({
        ...col,
        tasks: col.tasks.filter(task => task.id !== taskId),
      }))
    );

    this.saveAndSync();

    console.log('Tarea eliminada:', taskId);
  }

  /**
   * Obtiene una tarea por ID
   */
  getTask(taskId: string): TaskModel | null {
    for (const column of this.columnService.columns()) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) {
        return task;
      }
    }
    return null;
  }

  /**
   * Obtiene todas las tareas de una columna
   */
  getTasksByColumn(columnId: string): TaskModel[] {
    const column = this.columnService.columns().find(c => c.id === columnId);
    return column?.tasks || [];
  }

  /**
   * Guarda en localStorage y sincroniza con API
   */
  private saveAndSync(): void {
    const columns = this.columnService.columns();
    this.storage.saveColumns(columns);
    this.sync.syncColumns(columns);
  }
}
