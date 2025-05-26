import { Component }                             from '@angular/core';
import { CommonModule }                          from '@angular/common';
import { MatTabsModule }                         from '@angular/material/tabs';
import { take, switchMap }                       from 'rxjs/operators';

import {
  GenericPrescriptionTableComponent,
  Prescription,
  TableAction
} from '../generic-prescription-table/generic-prescription-table.component';
import { AuthService }                           from '../../../core/services/auth.service';
import { PrescriptionService }                   from '../../../core/services/prescription.service';
import { PrescriptionItemService }               from '../../../core/services/prescription-item.service';
import { ViewItemsModalComponent, PrescriptionItemView }
  from '../view-items-modal/view-items-modal.component';
import { CreateAppointmentModalComponent }
  from '../create-appointment-modal/create-appointment-modal.component';
import { AddMedicationModalComponent }
  from '../add-medication-modal/add-medication-modal.component';

@Component({
  selector: 'app-pharmacy-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    GenericPrescriptionTableComponent,
    ViewItemsModalComponent,
    CreateAppointmentModalComponent,
    AddMedicationModalComponent
  ],
  templateUrl: './pharmacy-dashboard.component.html',
})
export class PharmacyDashboardComponent {
  // Control de visibilidad de modales
  showAddMedModal = false;
  showItemsModal  = false;
  showCreateModal = false;

  // Prescripción seleccionada y datos auxiliares
  selectedPrescription!: Prescription;
  itemsToShow: PrescriptionItemView[] = [];

  // Lógica para cargar prescripciones
  fetchFn = () =>
    this.auth.user$.pipe(
      take(1),
      switchMap(u => this.prescSvc.findByPharmacyUser(u!.id))
    );

  // Mapeo de la respuesta Cruda a nuestro modelo
  mapFn = (p: any): Prescription => ({
    id:            p.id,
    patientName:   p.patient.username,
    patientEmail:  p.patient.email,
    requestDate:   new Date(p.createdAt),
    documentUrl:   p.fileUrl
  });

  // Acciones para cada tab
  prescActions: TableAction[] = [
    {
      label: 'See Document',
      hrefFn: p => p.documentUrl,
      openInNewTab: true,
      class: 'px-3 py-1 bg-teal-600 text-white rounded'
    }
  ];
  medActions: TableAction[] = [
    ...this.prescActions,
    {
      label: 'Add Medication',
      callback: p => this.openAddMedModal(p),
      class: 'px-3 py-1 bg-green-600 text-white rounded ml-2'
    }
  ];
  apptActions: TableAction[] = [
    {
      label: 'View Items',
      callback: p => this.openItemsModal(p),
      class: 'px-3 py-1 bg-blue-600 text-white rounded'
    },
    {
      label: 'Crear Appointment',
      callback: p => this.openCreateModalFn(p),
      class: 'px-3 py-1 bg-purple-600 text-white rounded ml-2'
    },
    {
      label: 'Confirm Delivery',
      callback: p => this.confirmDelivery(p),
      class: 'px-3 py-1 bg-indigo-600 text-white rounded ml-2'
    }
  ];

  constructor(
    private auth: AuthService,
    private prescSvc: PrescriptionService,
    private itemSvc: PrescriptionItemService
  ) {}

  // === Add Medication ===
  openAddMedModal(p: Prescription) {
    this.selectedPrescription = p;
    this.showAddMedModal = true;
  }
  onAddMedClose() {
    this.showAddMedModal = false;
    this.selectedPrescription = undefined!;

  }
  onAddMedSave(rows: any[]) {
    // Prepara payload con prescriptionId
    const payload = rows.map(r => ({
      prescriptionId: this.selectedPrescription.id,
      medicationId:   Number(r.medicationId),
      quantity:       r.quantity!,
      status:         r.status
    }));
    // Llamada a bulkCreate
this.itemSvc.bulkCreate(payload).subscribe({
  next: () => {
    alert('¡Medicamentos creados correctamente!');
    this.onAddMedClose();
  },
  error: () => {
    alert('Error al crear medicamentos.');
    this.onAddMedClose();
  }
});
  }

openItemsModal(p: Prescription) {
  this.selectedPrescription = p;
  this.itemSvc.getByPrescription(p.id).subscribe(items => {
    // Aquí convertimos al formato Row
    this.itemsToShow = items.map(i => ({
      medicationName: (i as any).medication?.name || '—',
      quantity:       i.quantity,
      status:         i.status
    }));
    this.showItemsModal = true;
  });
}



  // === Create Appointment ===
  openCreateModalFn(p: Prescription) {
    this.selectedPrescription = p;
    this.showCreateModal = true;
  }
  onCreateAppointment(d: Date) {
    console.log('Crear cita para', this.selectedPrescription, 'en', d);
    this.showCreateModal = false;
  }

  // === Confirm Delivery ===
  confirmDelivery(p: Prescription) {
    console.log('Confirm delivery for', p);
  }
}
