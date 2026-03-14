import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FreyButtonDirective } from 'freya/button';
import { FreyFormModule } from 'freya/form';
import { FreyInputValidationDirective } from 'freya/input-validation';

@Component({
  selector: 'app-column-update',
  imports: [
    ReactiveFormsModule,
    FreyFormModule,
    FreyButtonDirective,
    FreyInputValidationDirective,
  ],
  templateUrl: './column-update.component.html',
  styleUrl: './column-update.component.scss',
})
export class ColumnUpdateComponent implements OnInit {
  @Output() confirmEvent = new EventEmitter();
  @Output() closeEvent = new EventEmitter();
  dataSource = null;
  formGroup: FormGroup;

  private readonly formbuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formbuilder.group({
      columnName: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.dataSource) {
      this.formGroup.get('columnName')?.setValue(this.dataSource);
    }
  }

  onSubmit(): void {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.confirmEvent.emit(this.formGroup.value.columnName);
  }
}
