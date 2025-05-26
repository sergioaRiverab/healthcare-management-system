import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule }                          from '@angular/common';
import { FormsModule }                           from '@angular/forms';

@Component({
  selector: 'app-create-appointment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-appointment-modal.component.html',
})
export class CreateAppointmentModalComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() save  = new EventEmitter<Date>();

  dateTime = ''; // enlazado a <input type="datetime-local">

    ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true) {
      // Resetear el campo al abrir el modal
      this.dateTime = '';
    }
  }
  onSave() {
    if (this.dateTime) {
      this.save.emit(new Date(this.dateTime));
      this.close.emit();
    }
  }
}
