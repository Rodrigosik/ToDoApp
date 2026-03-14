import { Component, input, output } from '@angular/core';
import { MenuModel } from 'src/app/utils/models';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  options = input<MenuModel[]>([]);
  show = input<boolean>(false);
  selected = output<string>();

  onSelect(value: string): void {
    this.selected.emit(value);
  }
}
