import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRedirectComponentComponent } from './dashboard-redirect-component.component';

describe('DashboardRedirectComponentComponent', () => {
  let component: DashboardRedirectComponentComponent;
  let fixture: ComponentFixture<DashboardRedirectComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRedirectComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRedirectComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
