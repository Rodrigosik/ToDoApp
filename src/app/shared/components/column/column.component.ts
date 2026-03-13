import { Component, input, output } from '@angular/core';
import { ColumnModel, TaskModel } from 'src/app/core/services';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-column',
  imports: [TaskCardComponent],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
})
export class ColumnComponent {
  column = input<ColumnModel>();
  taskMoved = output<any>();

  addTask(): void {}

  onDragStart(event: DragEvent, task: TaskModel): void {
    event.dataTransfer?.setData('taskId', task.id);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const taskId = event.dataTransfer?.getData('taskId');
    if (taskId) {
      this.taskMoved.emit({ taskId, targetColumnId: this.column().id });
    }
  }
}
