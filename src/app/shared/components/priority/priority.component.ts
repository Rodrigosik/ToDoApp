import { Component, input } from '@angular/core';

enum PriorityEnum {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

@Component({
  selector: 'app-priority',
  imports: [],
  templateUrl: './priority.component.html',
  styleUrl: './priority.component.scss',
})
export class PriorityComponent {
  status = input();
  priorityEnum = PriorityEnum;
}
