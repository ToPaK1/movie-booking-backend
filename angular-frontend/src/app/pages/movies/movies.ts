import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie, MovieService } from '../../core/services/movie';
import { ShowsService, Show } from '../../core/services/shows';

@Component({
  selector: 'app-movies',
  imports: [RouterLink],
  templateUrl: './movies.html',
  styleUrl: './movies.css'
})
export class Movies implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly showsService = inject(ShowsService);

  movies = signal<Movie[]>([]);
  shows = signal<Show[]>([]);
  loading = signal(true);
  error = signal('');
  query = signal('');
  genre = signal('All');
  minRating = signal(0);

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading.set(true);
    this.error.set('');

    // Load movies independently so a problem with the shows endpoint
    // cannot make the entire Movies page disappear.
    this.movieService.getMovies().subscribe({
      next: movies => {
        this.movies.set(Array.isArray(movies) ? movies : []);
        this.loading.set(false);
        this.loadShows();
      },
      error: error => {
        console.error('Failed to load movies:', error);
        this.movies.set([]);
        this.shows.set([]);
        this.error.set(error?.error?.message || 'Failed to load movies.');
        this.loading.set(false);
      }
    });
  }

  private loadShows(): void {
    this.showsService.getShows().subscribe({
      next: shows => this.shows.set((shows || []).filter(show => this.isFutureShow(show))),
      error: error => {
        console.error('Failed to load shows:', error);
        // Shows are supplementary on this page. Keep the movies visible.
        this.shows.set([]);
      }
    });
  }

  private isFutureShow(show: Show): boolean {
    const value = new Date(`${show.show_date}T${show.show_time}`);
    return value.getTime() >= Date.now();
  }

  genres(): string[] {
    return ['All', ...new Set(this.movies().map(movie => movie.genre))];
  }

  filteredMovies(): Movie[] {
    const q = this.query().trim().toLowerCase();

    return this.movies().filter(movie =>
      (!q || movie.title.toLowerCase().includes(q) || movie.description?.toLowerCase().includes(q)) &&
      (this.genre() === 'All' || movie.genre === this.genre()) &&
      Number(movie.rating) >= this.minRating()
    );
  }

  cinemaCount(movieId: number): number {
    return new Set(
      this.shows()
        .filter(show => show.movie_id === movieId)
        .map(show => show.cinema_id)
    ).size;
  }

  showCount(movieId: number): number {
    return this.shows().filter(show => show.movie_id === movieId).length;
  }
}
