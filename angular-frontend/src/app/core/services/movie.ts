import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  duration: number;
  release_date: string;
  rating: number;
  poster: string;
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/movies';

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl).pipe(
      map((movies) => movies.map((movie) => this.normalizePoster(movie)))
    );
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`).pipe(
      map((movie) => this.normalizePoster(movie))
    );
  }

  private normalizePoster(movie: Movie): Movie {
    const fallbackPosters: Record<string, string> = {
      'Inception': 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
      'The Dark Knight': 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      'Interstellar': 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      'The Godfather': 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg'
    };

    const poster = movie.poster?.trim();
    const usablePoster = poster && !poster.startsWith('/images/')
      ? poster
      : fallbackPosters[movie.title] || '';

    return { ...movie, poster: usablePoster };
  }
}
