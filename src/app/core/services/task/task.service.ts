import { Injectable } from '@angular/core';
import { TaskModel } from './task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  addTask(columnId: string, task: Omit<TaskModel, 'id'>): void {
    console.log(`Adding task to column ${columnId}:`, task);
  }
  updateTask(taskId: string, updates: Partial<TaskModel>): void {
    console.log(`Updating task ${taskId} with:`, updates);
  }
  moveTask(taskId: string, targetColumnId: string): void {
    console.log(`Moving task ${taskId} to column ${targetColumnId}`);
  }
  deleteTask(taskId: string): void {
    console.log(`Deleting task ${taskId}`);
  }
}
