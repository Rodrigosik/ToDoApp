import { Component, inject, signal } from '@angular/core';
import { ColumnModel, TaskService } from 'src/app/core/services';
import { ColumnComponent, ColumnFormComponent } from 'src/app/shared';

@Component({
  selector: 'app-dashboard',
  imports: [ColumnComponent, ColumnFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  isAddingColumn = signal(false);
  columns = signal<ColumnModel[]>([]);

  private readonly taskService = inject(TaskService);

  addColumn(columnName: string): void {
    const column = new ColumnModel();
    column.id = crypto.randomUUID();
    column.title = columnName;
    column.tasks = [];
    column.order = 0;

    this.columns.update(columns => [...columns, column]);
    console.log(this.columns());
    this.toggleAddColumn();
  }

  onTaskMoved(event: { taskId: string; targetColumnId: string }): void {
    this.taskService.moveTask(event.taskId, event.targetColumnId);
  }

  toggleAddColumn(): void {
    this.isAddingColumn.update(value => !value);
  }
}
