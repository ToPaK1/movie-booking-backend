import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService, Movie } from '../../core/services/movie';
import { BookingService, Booking } from '../../core/services/booking';
import { ShowsService, Show } from '../../core/services/shows';
import { CinemasService, Cinema } from '../../core/services/cinemas';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  private moviesService = inject(MovieService);
  private bookingsService = inject(BookingService);
  private showsService = inject(ShowsService);
  private cinemasService = inject(CinemasService);

  movies = signal<Movie[]>([]);
  bookings = signal<Booking[]>([]);
  shows = signal<Show[]>([]);
  cinemas = signal<Cinema[]>([]);
  loading = signal(true);
  message = signal('');
  editingId = signal<number | null>(null);

  form: Partial<Movie> = {
    title: '',
    description: '',
    genre: '',
    duration: 120,
    release_date: '',
    rating: 8,
    poster: ''
  };

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);

    this.moviesService.getMovies().subscribe({
      next: movies => this.movies.set(movies),
      error: () => this.loading.set(false)
    });

    this.showsService.getShows().subscribe({
      next: shows => this.shows.set(shows),
      error: () => this.loading.set(false)
    });

    this.cinemasService.getCinemas().subscribe({
      next: cinemas => this.cinemas.set(cinemas),
      error: () => this.loading.set(false)
    });

    this.bookingsService.getAllBookings().subscribe({
      next: bookings => {
        this.bookings.set(bookings);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  toNumber(value: unknown): number {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  }

  get revenue(): number {
    return this.bookings().reduce(
      (total, booking) => total + this.toNumber(booking.total_price),
      0
    );
  }

  get tickets(): number {
    return this.bookings().reduce(
      (total, booking) => total + this.toNumber(booking.seats_booked),
      0
    );
  }

  movieRevenue(title: string): number {
    return this.bookings()
      .filter(booking => booking.movie_title === title)
      .reduce((total, booking) => total + this.toNumber(booking.total_price), 0);
  }

  revenuePercentage(value: number): number {
    return this.revenue > 0 ? (value / this.revenue) * 100 : 0;
  }

  editMovie(movie: Movie): void {
    this.editingId.set(movie.id);
    this.form = { ...movie };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm(): void {
    this.editingId.set(null);
    this.form = {
      title: '',
      description: '',
      genre: '',
      duration: 120,
      release_date: '',
      rating: 8,
      poster: ''
    };
  }

  saveMovie(): void {
    if (!this.form.title || !this.form.genre) {
      this.message.set('Title and genre are required.');
      return;
    }

    const request = this.editingId()
      ? this.moviesService.updateMovie(this.editingId()!, this.form)
      : this.moviesService.createMovie(this.form);

    request.subscribe({
      next: () => {
        const wasEditing = this.editingId() !== null;
        this.message.set(
          wasEditing ? 'Movie updated successfully.' : 'Movie created successfully.'
        );
        this.resetForm();
        this.refresh();
      },
      error: error => {
        this.message.set(error.error?.message || 'Could not save movie.');
      }
    });
  }

  deleteMovie(movie: Movie): void {
    if (!confirm(`Delete ${movie.title}?`)) {
      return;
    }

    this.moviesService.deleteMovie(movie.id).subscribe({
      next: () => {
        this.message.set('Movie deleted successfully.');
        this.refresh();
      },
      error: error => {
        this.message.set(error.error?.message || 'Delete failed.');
      }
    });
  }
}
