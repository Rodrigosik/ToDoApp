import { Injectable } from '@angular/core';
import { ColumnModel } from '../column/column.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly COLUMNS_KEY = 'test_columns';
  private readonly METADATA_KEY = 'test_metadata';

  saveColumns(columns: ColumnModel[]): void {
    try {
      localStorage.setItem(this.COLUMNS_KEY, JSON.stringify(columns));
      this.updateMetadata();
      console.log('Guardado en localStorage:', columns.length, 'columnas');
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
    }
  }

  getColumns(): ColumnModel[] {
    try {
      const stored = localStorage.getItem(this.COLUMNS_KEY);
      if (!stored) {
        return [];
      }

      const columns = JSON.parse(stored) as ColumnModel[];
      console.log('Cargado desde localStorage:', columns.length, 'columnas');
      return columns;
    } catch (error) {
      console.error('Error leyendo localStorage:', error);
      return [];
    }
  }

  clearAll(): void {
    localStorage.removeItem(this.COLUMNS_KEY);
    localStorage.removeItem(this.METADATA_KEY);
    console.log('localStorage limpiado');
  }

  getMetadata(): { lastModified: Date | null; columnsCount: number } {
    try {
      const stored = localStorage.getItem(this.METADATA_KEY);
      if (!stored) {
        return { lastModified: null, columnsCount: 0 };
      }

      const metadata = JSON.parse(stored);
      return {
        lastModified: metadata.lastModified ? new Date(metadata.lastModified) : null,
        columnsCount: metadata.columnsCount || 0,
      };
    } catch {
      return { lastModified: null, columnsCount: 0 };
    }
  }

  private updateMetadata(): void {
    const columns = this.getColumns();
    const metadata = {
      lastModified: new Date().toISOString(),
      columnsCount: columns.length,
    };
    localStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata));
  }
}
