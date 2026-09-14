import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Movie, MovieService } from '../../core/services/movie';
import { ShowsService, Show } from '../../core/services/shows';
import { CinemasService, Cinema } from '../../core/services/cinemas';
import { FavoritesService } from '../../core/services/favorites';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-movie-details',
  imports: [RouterLink],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css'
})
export class MovieDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly movieService = inject(MovieService);
  private readonly showsService = inject(ShowsService);
  private readonly cinemasService = inject(CinemasService);
  private readonly favoritesService = inject(FavoritesService);
  readonly auth = inject(AuthService);

  movie = signal<Movie | null>(null);
  shows = signal<Show[]>([]);
  cinemas = signal<Cinema[]>([]);
  favorite = signal(false);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('Invalid movie ID.');
      this.loading.set(false);
      return;
    }

    forkJoin({
      movie: this.movieService.getMovieById(id),
      shows: this.showsService.getShows(),
      cinemas: this.cinemasService.getCinemas()
    }).subscribe({
      next: ({ movie, shows, cinemas }) => {
        this.movie.set(movie);
        this.shows.set(
          shows
            .filter(show => show.movie_id === id)
            .filter(show => new Date(`${show.show_date}T${show.show_time}`).getTime() >= Date.now())
        );
        this.cinemas.set(cinemas);
        this.loading.set(false);

        if (this.auth.isLoggedIn()) {
          this.favoritesService.isFavorite(id).subscribe({
            next: state => this.favorite.set(state.favorite),
            error: () => {}
          });
        }
      },
      error: (err) => {
        console.error(err);
        this.error.set('Movie details or showtimes could not be loaded.');
        this.loading.set(false);
      }
    });
  }

  toggleFavorite(): void {
    const id = this.movie()?.id;
    if (!id || !this.auth.isLoggedIn()) return;

    this.favoritesService.toggle(id).subscribe({
      next: state => this.favorite.set(state.favorite)
    });
  }

  cinemaName(id: number): string {
    return this.cinemas().find(cinema => cinema.id === id)?.name ?? 'Cinema';
  }

  cinemaLocation(id: number): string {
    return this.cinemas().find(cinema => cinema.id === id)?.location ?? '';
  }

  movieShows(): Show[] {
    return this.shows();
  }

  formatDate(value: string): string {
    return new Date(`${value}T12:00:00`).toLocaleDateString('en-EG', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(value: string): string {
    return new Date(`2026-01-01T${value}`).toLocaleTimeString('en-EG', {
      hour: 'numeric',
      minute: '2-digit'
    });
  }
}
