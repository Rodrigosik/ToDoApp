import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { ColumnModel } from './column.model';

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  columnsSignal = signal<ColumnModel[]>([]);
  columns = this.columnsSignal.asReadonly();

  private readonly storage = inject(StorageService);

  addColumn(title: string): void {
    console.log('Adding column with title:', title);
  }

  deleteColumn(columnId: string): void {
    console.log('Deleting column with ID:', columnId);
  }

  reorderColumns(columns: ColumnModel[]): void {
    console.log('Reordering columns:', columns);
  }
}
