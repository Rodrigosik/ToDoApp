import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FreyButtonDirective } from 'freya/button';
import { FreyFormModule } from 'freya/form';
import { FreyInputValidationDirective } from 'freya/input-validation';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-column-form',
  imports: [
    ReactiveFormsModule,
    FreyFormModule,
    FreyButtonDirective,
    LucideAngularModule,
    FreyInputValidationDirective,
  ],
  templateUrl: './column-form.component.html',
  styleUrl: './column-form.component.scss',
})
export class ColumnFormComponent {
  formGroup: FormGroup;
  closeForm = output();
  nameColumn = output<string>();

  readonly icons = {
    x: X,
  };

  private readonly formbuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formbuilder.group({
      columnName: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.nameColumn.emit(this.formGroup.value.columnName);
  }
}
