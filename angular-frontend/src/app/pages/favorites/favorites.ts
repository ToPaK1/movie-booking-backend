import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie, MovieService } from '../../core/services/movie';
import { FavoritesService } from '../../core/services/favorites';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites implements OnInit {
  private readonly favoritesService = inject(FavoritesService);
  private readonly movieService = inject(MovieService);
  movies = signal<Movie[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.favoritesService.getFavorites().subscribe({
      next: movies => { this.movies.set(movies); this.loading.set(false); },
      error: () => { this.error.set('Unable to load your favorites.'); this.loading.set(false); }
    });
  }

  remove(movie: Movie): void {
    this.favoritesService.toggle(movie.id).subscribe({
      next: () => this.movies.update(items => items.filter(item => item.id !== movie.id)),
      error: () => this.error.set('Could not update favorites.')
    });
  }

  poster(movie: Movie): string { return this.movieService.posterUrl(movie); }
}
