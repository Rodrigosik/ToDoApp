import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FreyButtonDirective } from 'freya/button';
import {
  CircleCheckBig,
  Cloud,
  LucideAngularModule,
  RefreshCw,
  WifiOff,
} from 'lucide-angular';
import { BoardSyncService } from 'src/app/core/features/board/services';

@Component({
  selector: 'app-sync-status',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FreyButtonDirective],
  templateUrl: './sync-status.component.html',
  styleUrl: './sync-status.component.scss',
})
export class SyncStatusComponent {
  readonly syncService = inject(BoardSyncService);

  readonly icons = {
    cloud: Cloud,
    wifiOff: WifiOff,
    refreshCw: RefreshCw,
    checkCircle: CircleCheckBig,
  };
}
