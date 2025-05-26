// src/app/features/pharmacy/add-medication-modal/add-medication-modal.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { MedicationService, Medication } from '../../../core/services/medication.service';

/**
 * Row model ajustado: medicationId es opcional
 */
interface Row {
  medicationId?: number | null;
  medicationName?: string;
  quantity:      number | null;
  status:        string;
}

@Component({
  selector: 'app-add-medication-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-medication-modal.component.html',
})
export class AddMedicationModalComponent implements OnInit, OnChanges {
  /** Control de visibilidad y modo */
  @Input() visible    = false;
  @Input() readOnly   = false;

  /** Si vienen filas preexistentes (view mode) */
  @Input() rowsData: Row[] | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() save  = new EventEmitter<
    { medicationId: number; quantity: number; status: string }[]
  >();

  /** Para modo edición */
  count = 1;
  rows: Row[] = [];

  /** Catálogos */
  medications: Medication[] = [];
  statuses = [
    { value: 'PENDING',     label: 'Pendiente' },
    { value: 'ACCEPTED',    label: 'Aceptado' },
    { value: 'REJECTED',    label: 'Rechazado' },
    { value: 'BACKORDERED', label: 'Backorder' },
  ];

  constructor(private medSvc: MedicationService) {}

  ngOnInit(): void {
    // Cargo el catálogo de medicamentos
    this.medSvc.getAll().subscribe(list => this.medications = list);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && changes['visible'].currentValue) {
      if (this.readOnly && this.rowsData) {
        // Modo lectura: cargo las filas entrantes
        this.rows = this.rowsData.map(r => ({ ...r }));
      } else {
        // Modo edición: reset
        this.count = 1;
        this.generateRows();
      }
    }
  }

  generateRows(): void {
    this.rows = Array.from({ length: this.count }, () => ({
      medicationId: null,
      quantity:      null,
      status:        'PENDING'
    }));
  }

  /** Busca nombre en catálogo */
  getMedicationNameById(id: number | null | undefined): string {
    if (id == null) return '';
    const m = this.medications.find(x => x.id === id);
    return m ? m.name : '';
  }

  /** Busca etiqueta de estado */
  getStatusLabel(value: string | null | undefined): string {
    if (!value) return '';
    const s = this.statuses.find(x => x.value === value);
    return s ? s.label : '';
  }

  onSave(): void {
    const payload = this.rows.map(r => ({
      medicationId: r.medicationId!,
      quantity:      r.quantity!,
      status:        r.status
    }));
    this.save.emit(payload);
    this.close.emit();
  }
}
