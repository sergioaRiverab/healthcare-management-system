import { Component, Input, OnInit } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { Observable }               from 'rxjs';

/** Ahora incluimos el campo `id` */
export interface Prescription {
  id:            number;
  patientName:   string;
  patientEmail:  string;
  requestDate:   Date;
  documentUrl:   string;
  patientId?:   number;
  pharmacyId?: number;
}

export interface TableAction {
  label: string;
  hrefFn?:      (row: Prescription) => string;
  callback?:    (row: Prescription) => void;
  openInNewTab?: boolean;
  class?:       string;
}

@Component({
  selector: 'app-generic-prescription-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-prescription-table.component.html',
})
export class GenericPrescriptionTableComponent implements OnInit {
  @Input() fetchFn!: () => Observable<any[]>;
  @Input() mapFn!:   (raw: any) => Prescription;
  @Input() actions:  TableAction[] = [];

  prescriptions: Prescription[] = [];
  isLoading    = false;
  error: string | null = null;

  ngOnInit() {
    this.isLoading = true;
    this.fetchFn().subscribe({
      next: data => {
        this.prescriptions = data.map(this.mapFn);
        this.isLoading = false;
      },
      error: err => {
        this.error = err.message || 'Error loading data';
        this.isLoading = false;
      }
    });
  }
}
