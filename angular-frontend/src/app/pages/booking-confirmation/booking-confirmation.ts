import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookingService, Booking } from '../../core/services/booking';

@Component({
  selector: 'app-booking-confirmation',
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-confirmation.html',
  styleUrl: './booking-confirmation.css'
})
export class BookingConfirmation implements OnInit {
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);
  booking = signal<Booking | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.loading.set(false); this.error.set('Booking not found.'); return; }
    this.bookingService.getBookingById(id).subscribe({
      next: b => { this.booking.set(b); this.loading.set(false); },
      error: () => { this.loading.set(false); this.error.set('Unable to load your ticket.'); }
    });
  }

  seats(): string[] {
    const raw = this.booking()?.selected_seats;
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw || '[]'); } catch { return []; }
  }

  print(): void { window.print(); }
}
