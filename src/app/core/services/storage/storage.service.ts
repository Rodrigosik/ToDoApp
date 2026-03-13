import { Injectable } from '@angular/core';
import { ColumnModel } from '../column/column.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly COLUMNS_KEY = 'test_columns';

  saveColumns(columns: ColumnModel[]): void {
    localStorage.setItem(this.COLUMNS_KEY, JSON.stringify(columns));
  }

  getColumns(): ColumnModel[] {
    return [];
  }
}
