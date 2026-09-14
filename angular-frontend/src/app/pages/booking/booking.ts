import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService } from '../../core/services/booking';
import { ShowsService, Show } from '../../core/services/shows';
import { MovieService, Movie } from '../../core/services/movie';
import { CinemasService, Cinema } from '../../core/services/cinemas';

@Component({
  selector: 'app-booking',
  imports: [RouterLink],
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

  seats = signal(1);
  loading = signal(true);
  booking = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const showId = Number(this.route.snapshot.queryParamMap.get('show_id'));

    if (!showId) {
      this.errorMessage.set('No show was selected. Please choose a show first.');
      this.loading.set(false);
      return;
    }

    this.loadShow(showId);
  }

  private loadShow(showId: number): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.showsService.getShowById(showId).subscribe({
      next: (show) => {
        this.show.set(show);
        this.loading.set(false);
        this.loadMovie(show.movie_id);
        this.loadCinema(show.cinema_id);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(
          error.status === 404
            ? 'The selected show could not be found.'
            : 'Unable to load the selected show. Please try again.'
        );
      }
    });
  }

  private loadMovie(movieId: number): void {
    this.movieService.getMovieById(movieId).subscribe({
      next: (movie) => this.movie.set(movie),
      error: () => this.movie.set(null)
    });
  }

  private loadCinema(cinemaId: number): void {
    this.cinemasService.getCinemaById(cinemaId).subscribe({
      next: (cinema) => this.cinema.set(cinema),
      error: () => this.cinema.set(null)
    });
  }

  increaseSeats(): void {
    const currentShow = this.show();

    if (!currentShow) return;

    if (this.seats() < currentShow.available_seats) {
      this.seats.update(value => value + 1);
    }
  }

  decreaseSeats(): void {
    if (this.seats() > 1) {
      this.seats.update(value => value - 1);
    }
  }

  onSeatsChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Math.floor(Number(input.value));
    const max = this.show()?.available_seats ?? 1;

    this.seats.set(Math.min(Math.max(value || 1, 1), Math.max(max, 1)));
  }

  confirmBooking(): void {
    const currentShow = this.show();
    const userJson = localStorage.getItem('user');

    if (!currentShow || this.booking()) return;

    if (!userJson) {
      this.router.navigate(['/login']);
      return;
    }

    let user: any;

    try {
      user = JSON.parse(userJson);
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      return;
    }

    const customerName = user.name?.trim();
    const customerEmail = user.email?.trim();

    if (!customerName || !customerEmail) {
      this.errorMessage.set('Your account information is incomplete. Please log in again.');
      return;
    }

    if (this.seats() > currentShow.available_seats) {
      this.errorMessage.set('Not enough seats are available for this show.');
      return;
    }

    this.booking.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.bookingService.createBooking({
      customer_name: customerName,
      customer_email: customerEmail,
      show_id: currentShow.id,
      seats_booked: this.seats()
    }).subscribe({
      next: (response) => {
        this.booking.set(false);
        this.successMessage.set('Booking created successfully!');

        setTimeout(() => {
          this.router.navigate(['/bookings'], {
            queryParams: { booking_id: response.bookingId }
          });
        }, 700);
      },
      error: (error) => {
        this.booking.set(false);

        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
          return;
        }

        this.errorMessage.set(
          error.error?.message || 'Booking failed. Please try again.'
        );
      }
    });
  }
}
