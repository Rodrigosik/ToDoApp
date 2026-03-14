import { computed, inject, Injectable, signal } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { SyncService } from '../sync/sync.service';
import { ColumnModel } from './column.model';

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  columnsSignal = signal<ColumnModel[]>([]);
  columns = computed(() => this.columnsSignal());

  private readonly storage = inject(StorageService);
  private readonly sync = inject(SyncService);

  constructor() {
    this.loadColumns();
  }

  loadColumns(): void {
    const columns = this.storage.getColumns();
    this.columnsSignal.set(columns);
    console.log('Columnas cargadas:', columns.length);
  }

  addColumn(title: string): void {
    const newColumn: ColumnModel = {
      id: crypto.randomUUID(),
      title,
      order: this.columns().length,
      tasks: [],
    };

    // 1. Actualizar estado local
    this.columnsSignal.update(columns => [...columns, newColumn]);

    // 2. Persistir offline
    this.saveToStorage();

    // 3. Sincronizar con API (en background)
    this.sync.syncColumns(this.columns());

    console.log('Columna agregada:', title);
  }

  /**
   * Elimina una columna
   */
  deleteColumn(columnId: string): void {
    const column = this.columns().find(c => c.id === columnId);
    if (!column) {
      return;
    }

    // 1. Actualizar estado local
    this.columnsSignal.update(columns => columns.filter(c => c.id !== columnId));

    // 2. Persistir offline
    this.saveToStorage();

    // 3. Sincronizar con API
    this.sync.syncColumns(this.columns());

    console.log('Columna eliminada:', column.title);
  }

  reorderColumns(columns: ColumnModel[]): void {
    const reordered = columns.map((col, index) => ({
      ...col,
      order: index,
    }));

    // 1. Actualizar estado local
    this.columnsSignal.set(reordered);

    // 2. Persistir offline
    this.saveToStorage();

    // 3. Sincronizar con API
    this.sync.syncColumns(this.columns());

    console.log('Columnas reordenadas');
  }

  updateColumn(columnId: string, updates: Partial<ColumnModel>): void {
    this.columnsSignal.update(columns =>
      columns.map(col => (col.id === columnId ? { ...col, ...updates } : col))
    );

    this.saveToStorage();
    this.sync.syncColumns(this.columns());
  }

  private saveToStorage(): void {
    this.storage.saveColumns(this.columns());
  }
}
