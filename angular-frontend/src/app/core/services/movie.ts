import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Movie {
  id: number; title: string; description: string; genre: string; duration: number;
  release_date: string; rating: number; poster: string;
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/movies';

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token') || ''}` });
  }

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl).pipe(map(ms => ms.map(m => this.normalizePoster(m))));
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`).pipe(map(m => this.normalizePoster(m)));
  }

  createMovie(movie: Partial<Movie>): Observable<Movie> {
    return this.http.post<Movie>(this.apiUrl, movie, { headers: this.headers() });
  }

  updateMovie(id: number, movie: Partial<Movie>): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/${id}`, movie, { headers: this.headers() });
  }

  deleteMovie(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers() });
  }

  posterUrl(movie: Movie): string { return this.normalizePoster(movie).poster; }

  private normalizePoster(movie: Movie): Movie {
    const fallback: Record<string, string> = {
      'Inception': 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
      'The Dark Knight': 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      'Interstellar': 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      'The Godfather': 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      'الفيل الأزرق 2': 'https://assets.voxcinemas.com/posters/P_HO00007121.jpg',
      'كيرة والجن': 'https://www.vetogate.com/Upload/libfiles/77/2/841.jpg'
    };
    const poster = movie.poster?.trim();
    return {
      ...movie,
      poster: fallback[movie.title] || (poster && !poster.startsWith('/images/') ? poster : '')
    };
  }
}
