import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pharmacy-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pharmacy-dashboard.component.html',
  styleUrl: './pharmacy-dashboard.component.css'
})
export class PharmacyDashboardComponent implements OnInit {

  currentDate: Date = new Date();
  calendarDays: (number | null)[] = [];
  selectedDay: number | null = null;

  ngOnInit(): void {
    this.generateCalendar();
    this.selectedDay = this.currentDate.getDate(); // Select current day on load
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth(); // 0-indexed

    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    // Get the day of the week for the first day (0 for Sunday, 6 for Saturday)
    const firstDayOfWeek = firstDayOfMonth.getDay();

    // Get the number of days in the month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    this.calendarDays = [];

    // Add placeholder nulls for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      this.calendarDays.push(null);
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDays.push(i);
    }

    // Add placeholder nulls for days after the last day of the month to fill the last week
    const totalSlots = this.calendarDays.length;
    const remainingSlots = 42 - totalSlots; // 6 weeks * 7 days = 42
    for (let i = 0; i < remainingSlots; i++) {
        this.calendarDays.push(null);
    }

  }

  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  getMonthYear(): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return this.currentDate.toLocaleDateString(undefined, options);
  }

  selectDay(day: number | null): void {
    if (day !== null) {
      this.selectedDay = day;
      // You can add logic here to fetch/display notifications for the selected day
      console.log('Selected day:', this.selectedDay);
    }
  }

}
