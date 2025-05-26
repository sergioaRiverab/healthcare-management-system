import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicationModalComponent } from './add-medication-modal.component';

describe('AddMedicationModalComponent', () => {
  let component: AddMedicationModalComponent;
  let fixture: ComponentFixture<AddMedicationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMedicationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMedicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
