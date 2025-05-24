import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage-pharmacy-request',
  template: '<h2>Manage Pharmacy Request for ID: {{ requestId }}</h2>',
  standalone: true,
})
export class ManagePharmacyRequestComponent implements OnInit {
  requestId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('id');
  }
} 