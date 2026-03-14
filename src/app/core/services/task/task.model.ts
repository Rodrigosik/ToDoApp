export class TaskModel {
  id: string;
  title: string;
  description: string;
  priority: number;
  tags: string[];
  dueDate: Date | null;
  status: boolean;
  columnId: string;
}
