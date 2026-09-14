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

  ngOnInit(): void {
    this.movieService.getMovies().subscribe({
      next: movies => this.featuredMovies.set(movies.slice(0, 4)),
      error: () => this.featuredMovies.set([])
    });
  }
}
