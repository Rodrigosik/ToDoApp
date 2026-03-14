import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnUpdateComponent } from './column-update.component';

describe('ColumnUpdateComponent', () => {
  let component: ColumnUpdateComponent;
  let fixture: ComponentFixture<ColumnUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnUpdateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnUpdateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
