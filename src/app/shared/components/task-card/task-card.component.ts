import { DatePipe } from '@angular/common';
import { Component, HostListener, inject, input, signal } from '@angular/core';
import { FreyButtonDirective } from 'freya/button';
import { FreyCheckboxComponent } from 'freya/checkbox';
import { FreyModalConfigModel, FreyModalService } from 'freya/modal';
import { FreyTooltipDirective } from 'freya/tooltip';
import { CalendarDays, Ellipsis, LucideAngularModule } from 'lucide-angular';
import { Observable } from 'rxjs';
import { TaskModel, TaskService } from 'src/app/core/services';
import { PRIORITYLIST } from 'src/app/utils/constants';
import { LookupPipe } from '../../pipes';
import { MenuComponent } from '../menu/menu.component';
import { TaskFormComponent } from '../task-form/task-form.component';

enum PriorityEnum {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

@Component({
  selector: 'app-task-card',
  imports: [
    DatePipe,
    LucideAngularModule,
    FreyTooltipDirective,
    LookupPipe,
    MenuComponent,
    FreyButtonDirective,
    FreyCheckboxComponent,
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  task = input<TaskModel>();
  priorityList = [...PRIORITYLIST];
  priorityEnum = PriorityEnum;
  showMenu = signal(false);
  menuOptions = [
    { label: 'Editar', value: 'edit' },
    { label: 'Eliminar', value: 'delete' },
  ];

  readonly icons = {
    calendarDays: CalendarDays,
    ellipsis: Ellipsis,
  };

  private readonly modalService = inject(FreyModalService);
  private readonly taskService = inject(TaskService);

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.showMenu.set(!this.showMenu());
  }

  onMenuSelect(option: string): void {
    this.showMenu.set(false);
    if (option === 'delete') {
      this.taskService.deleteTask(this.task().id);
    } else if (option === 'edit') {
      this.openTaskForm().subscribe(result => {
        if (result) {
          this.taskService.updateTask(this.task().id, result);
        }
      });
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
    config.dataSource = this.task();
    config.dataSource.dueDate = this.task().dueDate
      ? new Date(this.task().dueDate)
      : null;
    return this.modalService.openModal(TaskFormComponent, config) as Observable<any>;
  }
}
