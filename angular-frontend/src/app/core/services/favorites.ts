import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from './movie';

export interface FavoriteState { favorite: boolean; message?: string; }

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/favorites';

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token') || ''}` });
  }

  getFavorites(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl, { headers: this.headers() });
  }

  isFavorite(movieId: number): Observable<FavoriteState> {
    return this.http.get<FavoriteState>(`${this.apiUrl}/${movieId}`, { headers: this.headers() });
  }

  toggle(movieId: number): Observable<FavoriteState> {
    return this.http.post<FavoriteState>(`${this.apiUrl}/${movieId}/toggle`, {}, { headers: this.headers() });
  }
}
