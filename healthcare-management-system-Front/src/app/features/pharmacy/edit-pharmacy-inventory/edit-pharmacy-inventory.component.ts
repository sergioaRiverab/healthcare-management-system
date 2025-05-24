import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-pharmacy-inventory',
  template: '<h2>Edit Pharmacy Inventory for Medicine ID: {{ medicineId }}</h2>',
  standalone: true,
})
export class EditPharmacyInventoryComponent implements OnInit {
  medicineId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.medicineId = this.route.snapshot.paramMap.get('medicineId');
  }
} 