
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/movies';

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }
}
