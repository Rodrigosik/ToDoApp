import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getStorageKey } from 'src/app/core/shared/config/storage.config';
import { BaseSyncService } from 'src/app/core/shared/services/sync/base-sync.service';
import { ColumnModel } from '../models';
import { BoardApiService } from './board-api.service';

/**
 * Servicio de Sincronización del Board
 * Responsabilidad: Sincronizar columnas del board con la API
 * Extiende BaseSyncService para reutilizar lógica online/offline
 */
@Injectable({
  providedIn: 'root',
})
export class BoardSyncService extends BaseSyncService<ColumnModel> {
  private readonly api = inject(BoardApiService);

  /**
   * Método público para sincronizar columnas
   * Alias más semántico de sync()
   */
  syncColumns(columns: ColumnModel[]): void {
    this.sync(columns);
  }

  protected getStorageKey(): string {
    return getStorageKey('COLUMNS');
  }

  protected saveToApi(data: ColumnModel[]): Observable<ColumnModel[]> {
    return this.api.saveColumns(data);
  }
}
