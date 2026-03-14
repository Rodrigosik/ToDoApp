import { TaskModel } from './task.model';

export class ColumnModel {
  id: string;
  title: string;
  order: number;
  tasks: TaskModel[];
}
