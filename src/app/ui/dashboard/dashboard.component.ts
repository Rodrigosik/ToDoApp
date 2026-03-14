import { Component, computed, inject, signal } from '@angular/core';
import { FreyButtonDirective } from 'freya/button';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { BoardStateService } from 'src/app/core/services';
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
  columnList = computed(() => this.boardState.columns());

  readonly icons = {
    plus: Plus,
  };

  private readonly boardState = inject(BoardStateService);

  constructor() {
    // Inicializar el estado del board al crear el componente
    this.boardState.initialize();
  }

  addColumn(columnName: string): void {
    this.boardState.addColumn(columnName);
    this.toggleAddColumn();
  }

  onTaskMoved(event: { taskId: string; targetColumnId: string }): void {
    this.boardState.moveTask(event.taskId, event.targetColumnId);
  }

  toggleAddColumn(): void {
    this.isAddingColumn.update(value => !value);
  }
}
