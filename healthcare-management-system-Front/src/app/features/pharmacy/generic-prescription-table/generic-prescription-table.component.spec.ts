import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericPrescriptionTableComponent } from './generic-prescription-table.component';

describe('GenericPrescriptionTableComponent', () => {
  let component: GenericPrescriptionTableComponent;
  let fixture: ComponentFixture<GenericPrescriptionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericPrescriptionTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericPrescriptionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
