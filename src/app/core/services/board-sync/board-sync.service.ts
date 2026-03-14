import { inject, Injectable, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { ColumnModel } from 'src/app/utils/models';
import { getStorageKey } from '../../config';
import { ApiService } from '../api/api.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class BoardSyncService {
  isSyncing = signal(false);
  isOnline = signal(navigator.onLine);
  pendingSyncs = signal(0);
  lastSyncTime = signal<Date>(null);

  private readonly api = inject(ApiService);
  private readonly storage = inject(StorageService);
  private readonly storageKey = getStorageKey('COLUMNS');

  constructor() {
    this.setupOnlineDetection();
  }

  syncColumns(columns: ColumnModel[]): void {
    if (!this.isOnline()) {
      console.log('Offline: Sincronización pendiente');
      this.pendingSyncs.update(count => count + 1);
      return;
    }

    this.isSyncing.set(true);

    this.api
      .saveColumns(columns)
      .pipe(
        tap(() => {
          console.log('Columnas sincronizadas con servidor');
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

  retrySyncPending(): void {
    if (this.pendingSyncs() > 0 && this.isOnline()) {
      console.log('Reintentando sincronización pendiente...');

      const currentColumns = this.storage.get<ColumnModel[]>(this.storageKey) || [];

      if (currentColumns.length > 0) {
        // Sincronizar el estado actual con la API
        this.syncColumns(currentColumns);
      } else {
        // No hay datos para sincronizar, resetear contador
        this.pendingSyncs.set(0);
        console.log('No hay datos pendientes para sincronizar');
      }
    }
  }

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
