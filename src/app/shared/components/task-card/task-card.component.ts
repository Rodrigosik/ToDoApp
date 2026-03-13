import { Component, input } from '@angular/core';
import { TaskModel } from 'src/app/core/services';

@Component({
  selector: 'app-task-card',
  imports: [],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  task = input<TaskModel>();
}
