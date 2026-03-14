export class TaskModel {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  dueDate: Date | null;
  status: string;
  columnId: string;
}
