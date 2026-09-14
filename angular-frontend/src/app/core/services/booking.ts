import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  id: number;
  customer_name: string;
  customer_email: string;
  show_id: number;
  seats_booked: number;
  user_id: number;
}

export interface CreateBookingRequest {
  customer_name: string;
  customer_email: string;
  show_id: number;
  seats_booked: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/bookings';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  createBooking(booking: CreateBookingRequest): Observable<{ message: string; bookingId: number }> {
    return this.http.post<{ message: string; bookingId: number }>(
      this.apiUrl,
      booking,
      { headers: this.getHeaders() }
    );
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(
      `${this.apiUrl}/my`,
      { headers: this.getHeaders() }
    );
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(
      `${this.apiUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }

  deleteBooking(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }
}
