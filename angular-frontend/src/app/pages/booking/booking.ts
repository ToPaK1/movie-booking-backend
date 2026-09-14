import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService } from '../../core/services/booking';
import { ShowsService, Show } from '../../core/services/shows';
import { MovieService, Movie } from '../../core/services/movie';
import { CinemasService, Cinema } from '../../core/services/cinemas';

@Component({
  selector: 'app-booking',
  imports: [CommonModule, RouterLink],
  templateUrl: './booking.html',
  styleUrl: './booking.css'
})
export class Booking implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingService = inject(BookingService);
  private showsService = inject(ShowsService);
  private movieService = inject(MovieService);
  private cinemasService = inject(CinemasService);

  show = signal<Show | null>(null);
  movie = signal<Movie | null>(null);
  cinema = signal<Cinema | null>(null);
  selectedSeats = signal<string[]>([]);
  loading = signal(true);
  booking = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  readonly rows = 'ABCDEFGHIJ'.split('');
  readonly seatNumbers = Array.from({ length: 20 }, (_, i) => i + 1);

  ngOnInit(): void {
    if (!localStorage.getItem('token')) { this.router.navigate(['/login']); return; }
    const showId = Number(this.route.snapshot.queryParamMap.get('show_id'));
    if (!showId) { this.errorMessage.set('No show was selected. Please choose a show first.'); this.loading.set(false); return; }
    this.loadShow(showId);
  }

  private loadShow(showId: number): void {
    this.showsService.getShowById(showId).subscribe({
      next: show => {
        this.show.set(show); this.loading.set(false); this.selectedSeats.set([]);
        this.movieService.getMovieById(show.movie_id).subscribe({ next: m => this.movie.set(m) });
        this.cinemasService.getCinemaById(show.cinema_id).subscribe({ next: c => this.cinema.set(c) });
      },
      error: () => { this.loading.set(false); this.errorMessage.set('Unable to load the selected show.'); }
    });
  }

  seatId(row: string, number: number): string { return `${row}${number}`; }
  isBooked(seat: string): boolean { return this.show()?.booked_seats?.includes(seat) ?? false; }
  isSelected(seat: string): boolean { return this.selectedSeats().includes(seat); }

  toggleSeat(seat: string): void {
    if (this.isBooked(seat) || this.booking()) return;
    this.selectedSeats.update(current => current.includes(seat) ? current.filter(s => s !== seat) : [...current, seat]);
    this.errorMessage.set('');
  }

  get totalPrice(): number { return this.selectedSeats().length * Number(this.show()?.ticket_price || 0); }

  confirmBooking(): void {
    const currentShow = this.show();
    if (!currentShow || this.booking()) return;
    if (!this.selectedSeats().length) { this.errorMessage.set('Please select at least one seat.'); return; }
    this.booking.set(true); this.errorMessage.set(''); this.successMessage.set('');
    this.bookingService.createBooking({ show_id: currentShow.id, selected_seats: this.selectedSeats() }).subscribe({
      next: response => {
        this.booking.set(false); this.successMessage.set('Booking confirmed! A confirmation email was sent to your account email.');
        setTimeout(() => this.router.navigate(['/bookings'], { queryParams: { booking_id: response.bookingId } }), 900);
      },
      error: error => {
        this.booking.set(false);
        if (error.status === 401) { localStorage.removeItem('token'); localStorage.removeItem('user'); this.router.navigate(['/login']); return; }
        this.errorMessage.set(error.error?.message || 'Booking failed. Please try again.');
        if (error.status === 409) this.loadShow(currentShow.id);
      }
    });
  }
}