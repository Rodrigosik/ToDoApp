import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FreyButtonDirective } from 'freya/button';
import { FreyCheckboxComponent } from 'freya/checkbox';
import { FreyDatepickerModule } from 'freya/datepicker';
import { FreyFormModule } from 'freya/form';
import { CalendarDays, LucideAngularModule } from 'lucide-angular';
import { PRIORITYLIST } from 'src/app/utils/constants';

@Component({
  selector: 'app-task-form',
  imports: [
    ReactiveFormsModule,
    FreyFormModule,
    FreyDatepickerModule,
    LucideAngularModule,
    FreyButtonDirective,
    FreyCheckboxComponent,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit {
  @Output() confirmEvent = new EventEmitter();
  @Output() closeEvent = new EventEmitter();
  dataSource = null;

  formGroup: FormGroup;
  priorityList = [...PRIORITYLIST];

  readonly icons = {
    calendar: CalendarDays,
  };
  readonly minDate = signal(new Date(Date.now() - 24 * 60 * 60 * 1000));

  private readonly formbuilder = inject(FormBuilder);

  get statusText(): string {
    const status = this.formGroup.get('status')?.value;
    return status ? 'Completada' : 'Pendiente';
  }

  constructor() {
    this.buildForm();
  }

  ngOnInit(): void {
    if (this.dataSource) {
      this.formGroup.patchValue(this.dataSource);
    }
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.confirmEvent.emit(this.formGroup.value);
  }

  private buildForm(): void {
    this.formGroup = this.formbuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      priority: [],
      tags: [], //TODO:
      dueDate: [null, [Validators.required]],
      status: [],
    });
  }
}
