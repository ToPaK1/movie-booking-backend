import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import {
  Booking,
  BookingService
} from '../../core/services/booking';

@Component({
  selector: 'app-bookings',
  imports: [RouterLink],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css'
})
export class Bookings implements OnInit {

  private bookingService = inject(BookingService);
  private router = inject(Router);

  bookings = signal<Booking[]>([]);

  loading = signal(true);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {

    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.bookingService.getMyBookings().subscribe({

      next: (bookings) => {

        this.loading.set(false);

        this.bookings.set(bookings || []);

      },

      error: (error) => {

        this.loading.set(false);

        console.error(
          'Failed to load bookings:',
          error
        );

        if (error.status === 401) {

          localStorage.removeItem('token');
          localStorage.removeItem('user');

          this.router.navigate(['/login']);

          return;
        }

        this.errorMessage.set(
          error.error?.message ||
          'Failed to load your bookings.'
        );
      }
    });
  }

  deleteBooking(id: number): void {

    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking?'
    );

    if (!confirmed) {
      return;
    }

    this.bookingService.deleteBooking(id).subscribe({

      next: (response) => {

        this.successMessage.set(
          response?.message ||
          'Booking cancelled successfully.'
        );

        this.loadBookings();
      },

      error: (error) => {

        console.error(
          'Failed to cancel booking:',
          error
        );

        this.errorMessage.set(
          error.error?.message ||
          'Failed to cancel booking.'
        );
      }
    });
  }

  refreshBookings(): void {
    this.loadBookings();
  }
}