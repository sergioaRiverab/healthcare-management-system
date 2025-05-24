import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pharmacy-appointment-detail',
  template: '<h2>Pharmacy Appointment Detail for ID: {{ id }}</h2>',
  standalone: true,
})
export class PharmacyAppointmentDetailComponent implements OnInit {
  id: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }
} 