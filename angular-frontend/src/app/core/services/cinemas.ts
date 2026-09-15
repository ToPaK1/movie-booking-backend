import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cinema {
  id: number;
  name: string;
  location: string;
  address?: string;
  total_seats?: number;
}

@Injectable({ providedIn: 'root' })
export class CinemasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/cinemas';

  private headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    });
  }

  getCinemas(): Observable<Cinema[]> {
    return this.http.get<Cinema[]>(this.apiUrl);
  }

  getCinemaById(id: number): Observable<Cinema> {
    return this.http.get<Cinema>(`${this.apiUrl}/${id}`);
  }

  createCinema(cinema: Partial<Cinema>): Observable<any> {
    return this.http.post(this.apiUrl, cinema, { headers: this.headers() });
  }

  updateCinema(id: number, cinema: Partial<Cinema>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cinema, { headers: this.headers() });
  }

  deleteCinema(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers() });
  }
}
