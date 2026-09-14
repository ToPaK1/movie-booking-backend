import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Show {
  id: number;
  movie_id: number;
  cinema_id: number;
  show_date: string;
  show_time: string;
  available_seats: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShowsService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/shows';

  getShows(): Observable<Show[]> {
    return this.http.get<Show[]>(this.apiUrl);
  }

  getShowById(id: number): Observable<Show> {
    return this.http.get<Show>(`${this.apiUrl}/${id}`);
  }
}