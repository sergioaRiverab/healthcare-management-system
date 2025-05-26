import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericAppointmentTableComponent } from './generic-appointment-table.component';

describe('GenericAppointmentTableComponent', () => {
  let component: GenericAppointmentTableComponent;
  let fixture: ComponentFixture<GenericAppointmentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericAppointmentTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericAppointmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
