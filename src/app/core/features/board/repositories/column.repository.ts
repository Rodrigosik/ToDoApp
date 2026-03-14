import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { getStorageKey } from 'src/app/core/shared/config';
import { IRepository } from 'src/app/core/shared/interfaces';
import { StorageService } from 'src/app/core/shared/services';
import { generateId } from 'src/app/utils/helpers';
import { ColumnModel } from '../models';

/**
 * Repositorio de Columnas
 * Responsabilidad: CRUD de columnas usando StorageService
 * Separa la lógica de persistencia de la lógica de negocio
 */
@Injectable({
  providedIn: 'root',
})
export class ColumnRepository implements IRepository<ColumnModel> {
  private readonly storage = inject(StorageService);
  private readonly storageKey = getStorageKey('COLUMNS');

  /**
   * Obtiene todas las columnas
   */
  getAll(): Observable<ColumnModel[]> {
    const columns = this.storage.get<ColumnModel[]>(this.storageKey) || [];
    return of(columns);
  }

  /**
   * Obtiene una columna por ID
   */
  getById(id: string): Observable<ColumnModel | null> {
    const columns = this.storage.get<ColumnModel[]>(this.storageKey) || [];
    const column = columns.find(c => c.id === id) || null;
    return of(column);
  }

  /**
   * Crea una nueva columna
   */
  create(columnData: Omit<ColumnModel, 'id'>): Observable<ColumnModel> {
    const columns = this.storage.get<ColumnModel[]>(this.storageKey) || [];

    const newColumn: ColumnModel = {
      ...columnData,
      id: generateId(),
    };

    columns.push(newColumn);
    this.storage.set(this.storageKey, columns);

    return of(newColumn);
  }

  /**
   * Actualiza una columna existente
   */
  update(id: string, updates: Partial<ColumnModel>): Observable<ColumnModel> {
    const columns = this.storage.get<ColumnModel[]>(this.storageKey) || [];
    const index = columns.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error(`Columna con ID ${id} no encontrada`);
    }

    columns[index] = { ...columns[index], ...updates };
    this.storage.set(this.storageKey, columns);

    return of(columns[index]);
  }

  /**
   * Elimina una columna
   */
  delete(id: string): Observable<void> {
    const columns = this.storage.get<ColumnModel[]>(this.storageKey) || [];
    const filtered = columns.filter(c => c.id !== id);

    this.storage.set(this.storageKey, filtered);
    return of(void 0);
  }

  /**
   * Guarda múltiples columnas (útil para sincronización)
   */
  saveAll(columns: ColumnModel[]): Observable<ColumnModel[]> {
    this.storage.set(this.storageKey, columns);
    return of(columns);
  }

  /**
   * Reordena columnas
   */
  reorder(columns: ColumnModel[]): Observable<ColumnModel[]> {
    const reordered = columns.map((col, index) => ({
      ...col,
      order: index,
    }));

    this.storage.set(this.storageKey, reordered);
    return of(reordered);
  }
}
