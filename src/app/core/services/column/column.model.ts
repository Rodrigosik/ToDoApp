import { TaskModel } from '../task/task.model';

export class ColumnModel {
  id: string;
  title: string;
  order: number;
  tasks: TaskModel[];
}
