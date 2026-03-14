import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FreyButtonDirective } from 'freya/button';
import { FreyCheckboxComponent } from 'freya/checkbox';
import { FreyDatepickerModule } from 'freya/datepicker';
import { FreyFormModule } from 'freya/form';
import { FreyInputValidationDirective } from 'freya/input-validation';
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
    FreyInputValidationDirective,
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
      const patch = { ...this.dataSource };
      if (Array.isArray(patch.tags)) {
        patch.tags = patch.tags.join(', ');
      }
      this.formGroup.patchValue(patch);
    }
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    const tagsInput = this.formGroup.get('tags').value;
    console.log('tagsInput', tagsInput);
    const tagsArray = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];

    this.confirmEvent.emit({
      ...this.formGroup.value,
      tags: tagsArray,
    });
  }

  private buildForm(): void {
    this.formGroup = this.formbuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      priority: [],
      tags: [],
      dueDate: [null, [Validators.required]],
      status: [],
    });
  }
}
