import { Component, inject, input, output } from '@angular/core';
import { FreyButtonDirective } from 'freya/button';
import { FreyModalConfigModel, FreyModalService } from 'freya/modal';
import { Ellipsis, LucideAngularModule, Plus } from 'lucide-angular';
import { Observable } from 'rxjs';
import { ColumnModel, TaskModel } from 'src/app/core/services';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-column',
  imports: [TaskCardComponent, FreyButtonDirective, LucideAngularModule],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
})
export class ColumnComponent {
  column = input<ColumnModel>();
  taskMoved = output<any>();

  readonly icons = {
    ellipsis: Ellipsis,
    plus: Plus,
  };

  private readonly modalService = inject(FreyModalService);

  addTask(): void {
    this.openTaskForm().subscribe(result => {
      if (result) {
        console.log('Nueva tarea creada:', result);
      }
    });
  }

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

  private openTaskForm(): Observable<any> {
    const config = new FreyModalConfigModel();
    config.customWidth.large = 30;
    config.customWidth.medium = 50;
    config.customWidth.small = 60;
    return this.modalService.openModal(TaskFormComponent, config) as Observable<any>;
  }
}
