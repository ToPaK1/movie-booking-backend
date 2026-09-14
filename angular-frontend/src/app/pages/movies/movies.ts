
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie, MovieService } from '../../core/services/movie';

@Component({
  selector: 'app-movies',
  imports: [RouterLink],
  templateUrl: './movies.html',
  styleUrl: './movies.css'
})
export class Movies implements OnInit {
  private readonly movieService = inject(MovieService);

  movies = signal<Movie[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading.set(true);
    this.error.set('');

    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movies.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load movies:', err);
        this.movies.set([]);
        this.error.set('Failed to load movies.');
        this.loading.set(false);
      }
    });
  }
}
