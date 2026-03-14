import { Component, HostListener, inject, input, output, signal } from '@angular/core';
import { FreyButtonDirective } from 'freya/button';
import { FreyModalConfigModel, FreyModalService } from 'freya/modal';
import { Ellipsis, LucideAngularModule, Plus } from 'lucide-angular';
import { Observable } from 'rxjs';
import {
  ColumnModel,
  ColumnService,
  TaskModel,
  TaskService,
} from 'src/app/core/services';
import { MenuComponent } from '../menu/menu.component';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-column',
  imports: [TaskCardComponent, FreyButtonDirective, LucideAngularModule, MenuComponent],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
  host: {
    '(drop)': 'onDrop($event)',
    '(dragover)': 'onDragOver($event)',
  },
})
export class ColumnComponent {
  column = input<ColumnModel>();
  taskMoved = output<any>();
  showMenu = signal(false);
  menuOptions = [{ label: 'Eliminar', value: 'delete' }];

  readonly icons = {
    ellipsis: Ellipsis,
    plus: Plus,
  };

  private readonly modalService = inject(FreyModalService);
  private readonly taskService = inject(TaskService);
  private readonly columnService = inject(ColumnService);

  addTask(): void {
    this.openTaskForm().subscribe(result => {
      if (result) {
        // Agregar la tarea usando el servicio con persistencia offline
        this.taskService.addTask(this.column().id, result);
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

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.showMenu.set(!this.showMenu());
  }

  onMenuSelect(option: string): void {
    this.showMenu.set(false);
    if (option === 'delete') {
      this.columnService.deleteColumn(this.column().id);
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.showMenu()) {
      this.showMenu.set(false);
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
