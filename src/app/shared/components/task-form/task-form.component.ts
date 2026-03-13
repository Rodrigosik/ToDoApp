import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  formGroup: FormGroup;
  private readonly formbuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formbuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      priority: [],
      tags: [],
      dueDate: [null, [Validators.required]],
    });
  }
}
