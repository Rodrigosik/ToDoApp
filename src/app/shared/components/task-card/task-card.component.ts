import { DatePipe } from '@angular/common';
import { Component, HostListener, inject, input, signal } from '@angular/core';
import { FreyButtonDirective } from 'freya/button';
import { FreyCheckboxComponent } from 'freya/checkbox';
import { FreyModalConfigModel, FreyModalService } from 'freya/modal';
import { CalendarDays, Ellipsis, LucideAngularModule } from 'lucide-angular';
import { Observable } from 'rxjs';
import { BoardStateService } from 'src/app/core/services';
import { PRIORITYLIST } from 'src/app/utils/constants';
import { TaskModel } from 'src/app/utils/models';
import { LookupPipe } from '../../pipes';
import { MenuComponent } from '../menu/menu.component';
import { PriorityComponent } from '../priority/priority.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-card',
  imports: [
    DatePipe,
    LucideAngularModule,
    LookupPipe,
    MenuComponent,
    FreyButtonDirective,
    FreyCheckboxComponent,
    PriorityComponent,
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  task = input<TaskModel>();
  priorityList = [...PRIORITYLIST];

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
  private readonly boardState = inject(BoardStateService);

  toggleMenu(): void {
    const isOpen = this.showMenu();

    if (!isOpen) {
      setTimeout(() => this.showMenu.set(true), 0);
    } else {
      this.showMenu.set(false);
    }
  }

  onMenuSelect(option: string): void {
    this.showMenu.set(false);
    if (option === 'delete') {
      this.boardState.deleteTask(this.task().id);
    } else if (option === 'edit') {
      this.openTaskForm().subscribe(result => {
        if (result) {
          this.boardState.updateTask(this.task().id, result);
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
