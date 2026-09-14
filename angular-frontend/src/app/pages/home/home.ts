import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie, MovieService } from '../../core/services/movie';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private readonly movieService = inject(MovieService);

  title = signal('Welcome to CineBook');
  subtitle = signal('Book your favorite movies, choose your cinema, and enjoy the show.');
  featuredMovies = signal<Movie[]>([]);
  moviesLoading = signal(true);
  moviesError = signal('');

  ngOnInit(): void {
    this.loadFeaturedMovies();
  }

  loadFeaturedMovies(): void {
    this.moviesLoading.set(true);
    this.moviesError.set('');

    this.movieService.getMovies().subscribe({
      next: movies => {
        const list = Array.isArray(movies) ? movies.filter(Boolean) : [];
        this.featuredMovies.set(list.slice(0, 4));
        this.moviesLoading.set(false);
      },
      error: error => {
        console.error('Failed to load featured movies:', error);
        this.featuredMovies.set([]);
        this.moviesError.set('Unable to load movies right now.');
        this.moviesLoading.set(false);
      }
    });
  }
}
