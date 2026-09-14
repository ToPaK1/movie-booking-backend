import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ShowsService, Show } from '../../core/services/shows';
import { MovieService, Movie } from '../../core/services/movie';
import { CinemasService, Cinema } from '../../core/services/cinemas';

@Component({
  selector: 'app-shows',
  imports: [],
  templateUrl: './shows.html',
  styleUrl: './shows.css'
})
export class Shows implements OnInit {
  private readonly showsService = inject(ShowsService);
  private readonly movieService = inject(MovieService);
  private readonly cinemasService = inject(CinemasService);
  private readonly router = inject(Router);

  shows = signal<Show[]>([]);
  movies = signal<Movie[]>([]);
  cinemas = signal<Cinema[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void { this.loadShows(); }

  loadShows(): void {
    this.loading.set(true);
    this.error.set('');

    forkJoin({
      shows: this.showsService.getShows(),
      movies: this.movieService.getMovies(),
      cinemas: this.cinemasService.getCinemas()
    }).subscribe({
      next: ({ shows, movies, cinemas }) => {
        this.shows.set(shows);
        this.movies.set(movies);
        this.cinemas.set(cinemas);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load shows. Please try again.');
        this.loading.set(false);
      }
    });
  }

  movieName(id: number): string {
    return this.movies().find(movie => movie.id === id)?.title ?? `Movie #${id}`;
  }

  cinemaName(id: number): string {
    return this.cinemas().find(cinema => cinema.id === id)?.name ?? `Cinema #${id}`;
  }

  bookNow(showId: number): void {
    this.router.navigate(['/booking'], { queryParams: { show_id: showId } });
  }
}