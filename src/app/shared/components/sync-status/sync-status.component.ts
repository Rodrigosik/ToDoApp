import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  CircleCheckBig,
  LucideAngularModule,
  RefreshCw,
  Wifi,
  WifiOff,
} from 'lucide-angular';
import { SyncService } from 'src/app/core/services';

@Component({
  selector: 'app-sync-status',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './sync-status.component.html',
  styleUrl: './sync-status.component.scss',
})
export class SyncStatusComponent {
  readonly syncService = inject(SyncService);

  readonly icons = {
    wifi: Wifi,
    wifiOff: WifiOff,
    refreshCw: RefreshCw,
    checkCircle: CircleCheckBig,
  };
}
