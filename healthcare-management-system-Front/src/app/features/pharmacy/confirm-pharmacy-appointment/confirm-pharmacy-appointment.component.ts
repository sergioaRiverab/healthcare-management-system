import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-pharmacy-appointment',
  template: '<h2>Confirm Pharmacy Appointment for ID: {{ id }}</h2>',
  standalone: true,
})
export class ConfirmPharmacyAppointmentComponent implements OnInit {
  id: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }
} 