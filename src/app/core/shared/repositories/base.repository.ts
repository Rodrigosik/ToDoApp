import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage/storage.service';

/**
 * Repositorio Base
 * Responsabilidad: Define contrato común para todos los repositorios
 * Proporciona acceso al StorageService
 */
export abstract class BaseRepository<T> {
  protected readonly storage = inject(StorageService);

  /**
   * Obtiene todos los elementos
   */
  abstract getAll(): Observable<T[]>;

  /**
   * Obtiene un elemento por ID
   */
  abstract getById(id: string): Observable<T | null>;

  /**
   * Crea un nuevo elemento
   */
  abstract create(data: Partial<T>): Observable<T>;

  /**
   * Actualiza un elemento existente
   */
  abstract update(id: string, updates: Partial<T>): Observable<T>;

  /**
   * Elimina un elemento
   */
  abstract delete(id: string): Observable<void>;

  /**
   * Cada repositorio define su storage key
   */
  protected abstract getStorageKey(): string;
}
