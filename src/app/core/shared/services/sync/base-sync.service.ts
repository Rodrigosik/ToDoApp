import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { StorageService } from '../storage/storage.service';

/**
 * Servicio Base de Sincronización
 * Responsabilidad: Lógica genérica de sincronización online/offline
 * Los servicios específicos deben extender esta clase
 */
@Injectable()
export abstract class BaseSyncService<T> {
  // Signals públicos para el estado de sincronización
  readonly isSyncing = signal(false);
  readonly isOnline = signal(navigator.onLine);
  readonly pendingSyncs = signal(0);
  readonly lastSyncTime = signal<Date | null>(null);

  protected readonly storage = inject(StorageService);

  constructor() {
    this.setupOnlineDetection();
  }

  /**
   * Sincroniza datos con la API
   */
  sync(data: T[]): void {
    if (!this.isOnline()) {
      console.log('Offline: Sincronización pendiente');
      this.pendingSyncs.update(count => count + 1);
      return;
    }

    this.isSyncing.set(true);

    this.saveToApi(data)
      .pipe(
        tap(() => {
          console.log('Datos sincronizados con servidor');
          this.lastSyncTime.set(new Date());
          this.pendingSyncs.set(0);
        }),
        catchError(error => {
          console.error('Error sincronizando:', error);
          this.pendingSyncs.update(count => count + 1);
          return of(null);
        })
      )
      .subscribe(() => {
        this.isSyncing.set(false);
      });
  }

  /**
   * Reintenta sincronizar datos pendientes
   */
  retrySyncPending(): void {
    if (this.pendingSyncs() > 0 && this.isOnline()) {
      console.log('Reintentando sincronización pendiente...');

      const storedData = this.storage.get<T[]>(this.getStorageKey()) || [];

      if (storedData.length > 0) {
        this.sync(storedData);
      } else {
        this.pendingSyncs.set(0);
        console.log('No hay datos pendientes para sincronizar');
      }
    }
  }

  /**
   * Método abstracto: cada feature define su storage key
   */
  protected abstract getStorageKey(): string;

  /**
   * Método abstracto: cada feature define cómo guardar en la API
   */
  protected abstract saveToApi(data: T[]): Observable<T[]>;

  /**
   * Configura detección de conexión online/offline
   */
  private setupOnlineDetection(): void {
    window.addEventListener('online', () => {
      console.log('Conexión restaurada');
      this.isOnline.set(true);
      this.retrySyncPending();
    });

    window.addEventListener('offline', () => {
      console.log('Sin conexión - modo offline');
      this.isOnline.set(false);
    });
  }
}
