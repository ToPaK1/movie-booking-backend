import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Movie, MovieService } from '../../core/services/movie';

@Component({
  selector: 'app-movie-details',
  imports: [RouterLink],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css'
})
export class MovieDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);

  movie = signal<Movie | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('Invalid movie ID.');
      this.loading.set(false);
      return;
    }

    this.movieService.getMovieById(id).subscribe({
      next: (data) => {
        this.movie.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Movie not found.');
        this.loading.set(false);
      }
    });
  }
}