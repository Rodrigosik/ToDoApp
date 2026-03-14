import { Component, computed, inject, signal } from '@angular/core';
import { FreyButtonDirective } from 'freya/button';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { ColumnService, TaskService } from 'src/app/core/services';
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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  isAddingColumn = signal(false);
  columnList = computed(() => this.columnService.columnsSignal());

  readonly icons = {
    plus: Plus,
  };

  private readonly columnService = inject(ColumnService);
  private readonly taskService = inject(TaskService);

  addColumn(columnName: string): void {
    this.columnService.addColumn(columnName);
    this.toggleAddColumn();
  }

  onTaskMoved(event: { taskId: string; targetColumnId: string }): void {
    this.taskService.moveTask(event.taskId, event.targetColumnId);
  }

  toggleAddColumn(): void {
    this.isAddingColumn.update(value => !value);
  }
}
