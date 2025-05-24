import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pharmacy-request-detail',
  template: '<h2>Pharmacy Request Detail for ID: {{ requestId }}</h2>',
  standalone: true,
})
export class PharmacyRequestDetailComponent implements OnInit {
  requestId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('id');
  }
} 