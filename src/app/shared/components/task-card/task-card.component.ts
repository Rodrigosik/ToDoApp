import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { FreyTooltipDirective } from 'freya/tooltip';
import { CalendarDays, LucideAngularModule } from 'lucide-angular';
import { TaskModel } from 'src/app/core/services';
import { PRIORITYLIST } from 'src/app/utils/constants';
import { LookupPipe } from '../../pipes';

enum PriorityEnum {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

@Component({
  selector: 'app-task-card',
  imports: [DatePipe, LucideAngularModule, FreyTooltipDirective, LookupPipe],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  task = input<TaskModel>();
  priorityList = [...PRIORITYLIST];
  priorityEnum = PriorityEnum;

  readonly icons = {
    calendarDays: CalendarDays,
  };
}
