import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { getStorageKey } from 'src/app/core/shared/config';
import { StorageService } from 'src/app/core/shared/services';
import { generateId } from 'src/app/utils/helpers';
import { ColumnModel, TaskModel } from '../models';

/**
 * Repositorio de Tareas
 * Responsabilidad: CRUD de tareas anidadas en columnas
 * Las tareas están almacenadas dentro de las columnas
 */
@Injectable({
  providedIn: 'root',
})
export class TaskRepository {
  private readonly storage = inject(StorageService);
  private readonly storageKey = getStorageKey('COLUMNS');

  /**
   * Obtiene una tarea por ID (busca en todas las columnas)
   */
  getById(taskId: string): Observable<TaskModel | null> {
    const columns = this.getColumns();

    for (const column of columns) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) {
        return of(task);
      }
    }

    return of(null);
  }

  /**
   * Obtiene todas las tareas de una columna específica
   */
  getByColumn(columnId: string): Observable<TaskModel[]> {
    const columns = this.getColumns();
    const column = columns.find(c => c.id === columnId);
    return of(column?.tasks || []);
  }

  /**
   * Crea una nueva tarea en una columna
   */
  create(
    columnId: string,
    taskData: Omit<TaskModel, 'id' | 'columnId' | 'order'>
  ): Observable<TaskModel> {
    const columns = this.getColumns();
    const columnIndex = columns.findIndex(c => c.id === columnId);

    if (columnIndex === -1) {
      throw new Error(`Columna con ID ${columnId} no encontrada`);
    }

    const newTask: TaskModel = {
      ...taskData,
      id: generateId(),
      columnId,
      order: columns[columnIndex].tasks.length, // Nueva tarea al final
    };

    columns[columnIndex] = {
      ...columns[columnIndex],
      tasks: [...columns[columnIndex].tasks, newTask],
    };

    this.saveColumns(columns);
    return of(newTask);
  }

  /**
   * Actualiza una tarea existente
   */
  update(taskId: string, updates: Partial<TaskModel>): Observable<TaskModel> {
    const columns = this.getColumns();
    let updatedTask: TaskModel | null = null;

    const updatedColumns = columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task => {
        if (task.id === taskId) {
          updatedTask = { ...task, ...updates };
          return updatedTask;
        }
        return task;
      }),
    }));

    if (!updatedTask) {
      throw new Error(`Tarea con ID ${taskId} no encontrada`);
    }

    this.saveColumns(updatedColumns);
    return of(updatedTask);
  }

  /**
   * Mueve una tarea de una columna a otra
   */
  move(
    taskId: string,
    targetColumnId: string,
    targetIndex?: number
  ): Observable<TaskModel> {
    const columns = this.getColumns();
    let taskToMove: TaskModel | null = null;
    let sourceColumnId: string | null = null;

    // Encontrar la tarea y su columna origen
    for (const column of columns) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) {
        taskToMove = task;
        sourceColumnId = column.id;
        break;
      }
    }

    if (!taskToMove || !sourceColumnId) {
      throw new Error(`Tarea con ID ${taskId} no encontrada`);
    }

    // Si ya está en la columna destino, no hacer nada
    if (sourceColumnId === targetColumnId && targetIndex === undefined) {
      return of(taskToMove);
    }

    // Remover de columna origen y agregar a columna destino
    const updatedColumns = columns.map(column => {
      if (column.id === sourceColumnId) {
        return {
          ...column,
          tasks: column.tasks.filter(t => t.id !== taskId),
        };
      }
      if (column.id === targetColumnId) {
        const movedTask = { ...taskToMove!, columnId: targetColumnId };
        const newTasks = [...column.tasks];

        // Insertar en posición específica o al final
        if (targetIndex !== undefined) {
          newTasks.splice(targetIndex, 0, movedTask);
        } else {
          newTasks.push(movedTask);
        }

        // Actualizar order de todas las tareas
        return {
          ...column,
          tasks: newTasks.map((task, index) => ({ ...task, order: index })),
        };
      }
      return column;
    });

    this.saveColumns(updatedColumns);

    return of({ ...taskToMove, columnId: targetColumnId });
  }

  /**
   * Reordena tareas dentro de una columna
   */
  reorder(columnId: string, taskIds: string[]): Observable<TaskModel[]> {
    const columns = this.getColumns();
    const columnIndex = columns.findIndex(c => c.id === columnId);

    if (columnIndex === -1) {
      throw new Error(`Columna con ID ${columnId} no encontrada`);
    }

    // Crear mapa de tareas por ID para acceso rápido
    const tasksMap = new Map(columns[columnIndex].tasks.map(task => [task.id, task]));

    // Reordenar según el array de IDs y actualizar order
    const reorderedTasks = taskIds
      .map(id => tasksMap.get(id))
      .filter((task): task is TaskModel => task !== undefined)
      .map((task, index) => ({ ...task, order: index }));

    columns[columnIndex] = {
      ...columns[columnIndex],
      tasks: reorderedTasks,
    };

    this.saveColumns(columns);
    return of(reorderedTasks);
  }

  /**
   * Elimina una tarea
   */
  delete(taskId: string): Observable<void> {
    const columns = this.getColumns();

    const updatedColumns = columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(t => t.id !== taskId),
    }));

    this.saveColumns(updatedColumns);
    return of(void 0);
  }

  /**
   * Obtiene todas las tareas (de todas las columnas)
   */
  getAll(): Observable<TaskModel[]> {
    const columns = this.getColumns();
    const allTasks = columns.flatMap(column => column.tasks);
    return of(allTasks);
  }

  /**
   * Obtiene todas las columnas (necesario para acceder a las tareas)
   */
  private getColumns(): ColumnModel[] {
    return this.storage.get<ColumnModel[]>(this.storageKey) || [];
  }

  /**
   * Guarda todas las columnas
   */
  private saveColumns(columns: ColumnModel[]): void {
    this.storage.set(this.storageKey, columns);
  }
}
