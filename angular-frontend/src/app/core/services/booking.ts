import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Booking{id:number;customer_name:string;customer_email:string;show_id:number;seats_booked:number;selected_seats:string[]|string;ticket_price:number;total_price:number;user_id:number;movie_title:string;cinema_name:string;show_date:string;show_time:string;}
export interface CreateBookingRequest{show_id:number;selected_seats:string[];}
@Injectable({providedIn:'root'}) export class BookingService{
 private http=inject(HttpClient);private apiUrl='http://localhost:3000/api/bookings';
 private getHeaders():HttpHeaders{return new HttpHeaders({Authorization:`Bearer ${localStorage.getItem('token')||''}`});}
 createBooking(b:CreateBookingRequest):Observable<{message:string;bookingId:number;booking:Booking}>{return this.http.post<{message:string;bookingId:number;booking:Booking}>(this.apiUrl,b,{headers:this.getHeaders()});}
 getAllBookings():Observable<Booking[]>{return this.http.get<Booking[]>(this.apiUrl,{headers:this.getHeaders()});}
 getMyBookings():Observable<Booking[]>{return this.http.get<Booking[]>(`${this.apiUrl}/my`,{headers:this.getHeaders()});}
 getBookingById(id:number):Observable<Booking>{return this.http.get<Booking>(`${this.apiUrl}/${id}`,{headers:this.getHeaders()});}
 deleteBooking(id:number):Observable<any>{return this.http.delete(`${this.apiUrl}/${id}`,{headers:this.getHeaders()});}
}
