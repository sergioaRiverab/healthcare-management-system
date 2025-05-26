import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule }                          from '@angular/common';

export interface PrescriptionItemView {
  medicationName: string;
  quantity:       number;
  status:         string;
}

@Component({
  selector: 'app-view-items-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-items-modal.component.html',
})
export class ViewItemsModalComponent {
  @Input() visible = false;
  @Input() items: PrescriptionItemView[] = [];
  @Output() close = new EventEmitter<void>();
}
