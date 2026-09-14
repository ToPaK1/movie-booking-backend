import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cinema {
  id: number;
  name: string;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class CinemasService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/cinemas';

  getCinemas(): Observable<Cinema[]> {
    return this.http.get<Cinema[]>(this.apiUrl);
  }

  getCinemaById(id: number): Observable<Cinema> {
    return this.http.get<Cinema>(`${this.apiUrl}/${id}`);
  }
}
