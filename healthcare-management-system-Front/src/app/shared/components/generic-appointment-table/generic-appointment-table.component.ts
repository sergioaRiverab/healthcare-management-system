import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';

export interface TableAction<T> {
  label: string;
  callback?: (row: T) => void;
  hrefFn?: (row: T) => string;
  openInNewTab?: boolean;
  class?: string;
}

@Component({
  selector: 'app-generic-appointment-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './generic-appointment-table.component.html',
})
export class GenericAppointmentTableComponent<T = any> implements OnInit {
  @Input() fetchFn!: () => Observable<any[]>;
  @Input() mapFn!: (raw: any) => T;
  @Input() actions: TableAction<T>[] = [];

  data: T[] = [];
  displayedColumns = ['id', 'date', 'status', 'actions'];

  ngOnInit() {
    this.fetchFn().subscribe(rawList => {
      this.data = rawList.map(item => this.mapFn(item));
      console.log('Data fetched and mapped:', this.data);
    });
  }
}
