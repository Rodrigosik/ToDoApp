import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { ColumnModel, TaskModel } from 'src/app/utils/models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly DELAY_MS = 500;

  // Simula la obtención de columnas desde un servidor
  getColumns(): Observable<ColumnModel[]> {
    const storedColumns = localStorage.getItem('test_columns');
    const columns = storedColumns ? JSON.parse(storedColumns) : [];
    console.log('API: obteniendo columnas del servidor simulado');
    return of(columns).pipe(delay(this.DELAY_MS));
  }

  // Simula el guardado en servidor
  saveColumns(columns: ColumnModel[]): Observable<ColumnModel[]> {
    console.log('API: guardando columnas en servidor simulado');
    return of(columns).pipe(delay(this.DELAY_MS));
  }

  // Simula agregar una tarea
  addTask(task: TaskModel): Observable<TaskModel> {
    console.log('API: agregando tarea en servidor simulado', task);
    return of(task).pipe(delay(this.DELAY_MS));
  }

  // Simula actualizar una tarea
  updateTask(taskId: string, updates: Partial<TaskModel>): Observable<TaskModel> {
    console.log('API: actualizando tarea en servidor simulado', taskId, updates);
    return of({ ...updates, id: taskId } as TaskModel).pipe(delay(this.DELAY_MS));
  }

  // Simula eliminar una tarea
  deleteTask(taskId: string): Observable<void> {
    console.log('API: eliminando tarea en servidor simulado', taskId);
    return of(void 0).pipe(delay(this.DELAY_MS));
  }
}
