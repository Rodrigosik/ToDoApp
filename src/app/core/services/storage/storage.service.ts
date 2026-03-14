import { Injectable } from '@angular/core';
import { safeParse, safeStringify } from 'src/app/utils/helpers';
import { IStorageService } from '../../interfaces';

/**
 * Servicio de Storage
 * Responsabilidad ÚNICA: Manejar localStorage de forma genérica
 * No conoce sobre columnas, tareas, ni metadatos específicos
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService implements IStorageService {
  /**
   * Obtiene un valor del localStorage y lo deserializa
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return safeParse<T>(item);
    } catch (error) {
      console.error(`Error obteniendo clave "${key}":`, error);
      return null;
    }
  }

  /**
   * Guarda un valor en localStorage serializándolo
   */
  set<T>(key: string, value: T): void {
    try {
      const serialized = safeStringify(value);
      if (serialized !== null) {
        localStorage.setItem(key, serialized);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('localStorage lleno. Considera limpiar datos antiguos.');
      } else {
        console.error(`Error guardando clave "${key}":`, error);
      }
    }
  }

  /**
   * Elimina una clave específica
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error eliminando clave "${key}":`, error);
    }
  }

  /**
   * Limpia todo el localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error limpiando localStorage:', error);
    }
  }

  /**
   * Verifica si existe una clave
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Obtiene todas las claves disponibles
   */
  keys(): string[] {
    return Object.keys(localStorage);
  }

  /**
   * Limpia claves que coincidan con un prefijo
   */
  clearByPrefix(prefix: string): void {
    const keysToRemove = this.keys().filter(key => key.startsWith(prefix));
    keysToRemove.forEach(key => this.remove(key));
  }
}
