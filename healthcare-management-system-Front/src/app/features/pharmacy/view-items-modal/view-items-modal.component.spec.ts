import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewItemsModalComponent } from './view-items-modal.component';

describe('ViewItemsModalComponent', () => {
  let component: ViewItemsModalComponent;
  let fixture: ComponentFixture<ViewItemsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewItemsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewItemsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
