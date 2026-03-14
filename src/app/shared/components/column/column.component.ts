import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, HostListener, inject, input, output, signal } from '@angular/core';
import { FreyButtonDirective } from 'freya/button';
import { FreyModalConfigModel, FreyModalService } from 'freya/modal';
import { Ellipsis, LucideAngularModule, Plus } from 'lucide-angular';
import { Observable } from 'rxjs';

import { ColumnModel, TaskModel } from 'src/app/core/features/board/models';
import { BoardStateService } from 'src/app/core/features/board/services';
import { ColumnUpdateComponent } from '../column-update/column-update.component';
import { MenuComponent } from '../menu/menu.component';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-column',
  imports: [
    TaskCardComponent,
    FreyButtonDirective,
    LucideAngularModule,
    MenuComponent,
    DragDropModule,
  ],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
})
export class ColumnComponent {
  column = input<ColumnModel>();
  connectedLists = input<string[]>([]);
  taskMoved = output<any>();
  showMenu = signal(false);
  menuOptions = [
    { label: 'Editar', value: 'edit' },
    { label: 'Eliminar', value: 'delete' },
  ];

  readonly icons = {
    ellipsis: Ellipsis,
    plus: Plus,
  };

  private readonly modalService = inject(FreyModalService);
  private readonly boardState = inject(BoardStateService);

  addTask(): void {
    this.openTaskForm().subscribe(result => {
      if (result) {
        // Agregar la tarea usando el servicio con persistencia offline
        this.boardState.addTask(this.column().id, result);
      }
    });
  }

  editColumn(): void {
    this.openColumnForm().subscribe(result => {
      if (result) {
        // Editar la columna usando el servicio con persistencia offline
        const updatedColumn = { ...this.column(), title: result };
        this.boardState.updateColumn(this.column().id, updatedColumn);
      }
    });
  }

  onTaskDrop(event: CdkDragDrop<TaskModel[]>): void {
    const columnId = this.column().id;

    if (event.previousContainer === event.container) {
      // Reordenar dentro de la misma columna
      const taskIds = event.container.data.map(task => task.id);
      moveItemInArray(taskIds, event.previousIndex, event.currentIndex);
      this.boardState.reorderTasks(columnId, taskIds);
    } else {
      // Mover entre columnas
      const task = event.previousContainer.data[event.previousIndex];
      this.taskMoved.emit({
        taskId: task.id,
        targetColumnId: columnId,
        targetIndex: event.currentIndex,
      });
    }
  }

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
      this.boardState.deleteColumn(this.column().id);
    }
    if (option === 'edit') {
      this.editColumn();
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

  private openColumnForm(): Observable<any> {
    const config = new FreyModalConfigModel();
    config.customWidth.large = 30;
    config.customWidth.medium = 40;
    config.customWidth.small = 60;
    config.dataSource = this.column().title;
    return this.modalService.openModal(ColumnUpdateComponent, config) as Observable<any>;
  }
}
