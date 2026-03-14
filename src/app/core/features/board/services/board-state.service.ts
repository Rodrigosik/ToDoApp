import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ColumnModel, TaskModel } from '../models';
import { ColumnRepository, TaskRepository } from '../repositories';
import { BoardSyncService } from './board-sync.service';

/**
 * Servicio de Estado del Board
 * Responsabilidad: Orquestar operaciones complejas y mantener estado global
 * Simplifica la interacción para los componentes
 */
@Injectable({
  providedIn: 'root',
})
export class BoardStateService {
  // Estado reactivo (Signal con API pública readonly)
  readonly columnsSignal = signal<ColumnModel[]>([]);
  readonly columns = this.columnsSignal.asReadonly();

  private readonly columnRepo = inject(ColumnRepository);
  private readonly taskRepo = inject(TaskRepository);
  private readonly sync = inject(BoardSyncService);

  /**
   * Inicializa el estado cargando desde el repositorio
   */
  initialize(): void {
    this.columnRepo
      .getAll()
      .pipe(
        tap(columns => {
          this.columnsSignal.set(columns);
          console.log('Board inicializado con', columns.length, 'columnas');
        })
      )
      .subscribe();
  }

  /**
   * Agrega una nueva columna (operación completa: persistencia + sync)
   */
  addColumn(title: string): void {
    const columnData = {
      title,
      order: this.columns().length,
      tasks: [],
    };

    this.columnRepo
      .create(columnData)
      .pipe(
        tap(newColumn => {
          // Actualizar estado local (optimistic update)
          this.columnsSignal.update(cols => [...cols, newColumn]);

          // Sincronizar con API
          this.sync.syncColumns(this.columns());
        })
      )
      .subscribe();
  }

  /**
   * Elimina una columna
   */
  deleteColumn(columnId: string): void {
    this.columnRepo
      .delete(columnId)
      .pipe(
        tap(() => {
          // Actualizar estado local
          this.columnsSignal.update(cols => cols.filter(c => c.id !== columnId));

          // Sincronizar
          this.sync.syncColumns(this.columns());
        })
      )
      .subscribe();
  }

  /**
   * Reordena columnas
   */
  reorderColumns(columns: ColumnModel[]): void {
    this.columnRepo
      .reorder(columns)
      .pipe(
        tap(reordered => {
          this.columnsSignal.set(reordered);
          this.sync.syncColumns(reordered);
        })
      )
      .subscribe();
  }

  /**
   * Actualiza una columna
   */
  updateColumn(columnId: string, updates: Partial<ColumnModel>): void {
    this.columnRepo
      .update(columnId, updates)
      .pipe(
        tap(updated => {
          this.columnsSignal.update(cols =>
            cols.map(c => (c.id === columnId ? updated : c))
          );
          this.sync.syncColumns(this.columns());
        })
      )
      .subscribe();
  }

  /**
   * Obtiene una columna por ID
   */
  getColumn(columnId: string): ColumnModel | undefined {
    return this.columns().find(c => c.id === columnId);
  }

  /**
   * Guarda el estado completo (útil para sincronización)
   */
  saveState(columns: ColumnModel[]): void {
    this.columnRepo
      .saveAll(columns)
      .pipe(tap(() => this.columnsSignal.set(columns)))
      .subscribe();
  }

  // ==========================================
  // MÉTODOS DE TAREAS
  // ==========================================

  /**
   * Agrega una nueva tarea a una columna
   */
  addTask(
    columnId: string,
    taskData: Omit<TaskModel, 'id' | 'columnId' | 'order'>
  ): void {
    this.taskRepo
      .create(columnId, taskData)
      .pipe(
        tap(newTask => {
          // Actualizar estado local (optimistic update)
          this.columnsSignal.update(cols =>
            cols.map(col =>
              col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
            )
          );

          // Sincronizar con API
          this.sync.syncColumns(this.columns());

          console.log('Tarea agregada:', newTask.title);
        })
      )
      .subscribe();
  }

  /**
   * Actualiza una tarea existente
   */
  updateTask(taskId: string, updates: Partial<TaskModel>): void {
    this.taskRepo
      .update(taskId, updates)
      .pipe(
        tap(updatedTask => {
          // Actualizar estado local
          this.columnsSignal.update(cols =>
            cols.map(col => ({
              ...col,
              tasks: col.tasks.map(task => (task.id === taskId ? updatedTask : task)),
            }))
          );

          // Sincronizar
          this.sync.syncColumns(this.columns());

          console.log('Tarea actualizada:', taskId);
        })
      )
      .subscribe();
  }

  /**
   * Mueve una tarea de una columna a otra
   */
  moveTask(taskId: string, targetColumnId: string, targetIndex?: number): void {
    this.taskRepo
      .move(taskId, targetColumnId, targetIndex)
      .pipe(
        tap(movedTask => {
          // Actualizar estado local
          this.columnsSignal.update(cols =>
            cols.map(col => {
              // Remover de columna origen
              if (col.tasks.some(t => t.id === taskId)) {
                return {
                  ...col,
                  tasks: col.tasks.filter(t => t.id !== taskId),
                };
              }
              // Agregar a columna destino
              if (col.id === targetColumnId) {
                const newTasks = [...col.tasks];
                if (targetIndex !== undefined) {
                  newTasks.splice(targetIndex, 0, movedTask);
                } else {
                  newTasks.push(movedTask);
                }
                return {
                  ...col,
                  tasks: newTasks,
                };
              }
              return col;
            })
          );

          // Sincronizar
          this.sync.syncColumns(this.columns());

          console.log('Tarea movida:', taskId, 'a columna:', targetColumnId);
        })
      )
      .subscribe();
  }

  /**
   * Elimina una tarea
   */
  deleteTask(taskId: string): void {
    this.taskRepo
      .delete(taskId)
      .pipe(
        tap(() => {
          // Actualizar estado local
          this.columnsSignal.update(cols =>
            cols.map(col => ({
              ...col,
              tasks: col.tasks.filter(task => task.id !== taskId),
            }))
          );

          // Sincronizar
          this.sync.syncColumns(this.columns());

          console.log('Tarea eliminada:', taskId);
        })
      )
      .subscribe();
  }

  /**
   * Obtiene una tarea por ID
   */
  getTask(taskId: string): TaskModel | null {
    for (const column of this.columns()) {
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
    const column = this.columns().find(c => c.id === columnId);
    return column?.tasks || [];
  }

  /**
   * Reordena tareas dentro de una columna
   */
  reorderTasks(columnId: string, taskIds: string[]): void {
    this.taskRepo
      .reorder(columnId, taskIds)
      .pipe(
        tap(reorderedTasks => {
          // Actualizar estado local
          this.columnsSignal.update(cols =>
            cols.map(col =>
              col.id === columnId ? { ...col, tasks: reorderedTasks } : col
            )
          );

          // Sincronizar
          this.sync.syncColumns(this.columns());

          console.log('Tareas reordenadas en columna:', columnId);
        })
      )
      .subscribe();
  }
}
