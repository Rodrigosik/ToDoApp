import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, computed, inject, signal } from '@angular/core';
import { FreyButtonDirective } from 'freya/button';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { ColumnModel } from 'src/app/core/features/board/models';
import { BoardStateService } from 'src/app/core/features/board/services';

import {
  ColumnComponent,
  ColumnFormComponent,
  SyncStatusComponent,
} from 'src/app/shared/components';

@Component({
  selector: 'app-dashboard',
  imports: [
    ColumnComponent,
    ColumnFormComponent,
    SyncStatusComponent,
    LucideAngularModule,
    FreyButtonDirective,
    DragDropModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  isAddingColumn = signal(false);
  columnList = computed(() => this.boardState.columns());
  columnIds = computed(() => this.columnList().map(col => `task-list-${col.id}`));

  readonly icons = {
    plus: Plus,
  };

  private readonly boardState = inject(BoardStateService);

  constructor() {
    this.boardState.initialize();
  }

  addColumn(columnName: string): void {
    this.boardState.addColumn(columnName);
    this.toggleAddColumn();
  }

  onTaskMoved(event: {
    taskId: string;
    targetColumnId: string;
    targetIndex?: number;
  }): void {
    this.boardState.moveTask(event.taskId, event.targetColumnId, event.targetIndex);
  }

  onColumnDrop(event: CdkDragDrop<ColumnModel[]>): void {
    const columns = [...this.columnList()];
    moveItemInArray(columns, event.previousIndex, event.currentIndex);
    this.boardState.reorderColumns(columns);
  }

  toggleAddColumn(): void {
    this.isAddingColumn.update(value => !value);
  }
}
