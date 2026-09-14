import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Show { id:number; movie_id:number; cinema_id:number; show_date:string; show_time:string; available_seats:number; ticket_price:number; movie_title?:string; cinema_name?:string; booked_seats?:string[]; }

@Injectable({ providedIn:'root' })
export class ShowsService {
  private readonly http=inject(HttpClient);
  private readonly apiUrl='http://localhost:3000/api/shows';
  private headers():HttpHeaders{return new HttpHeaders({Authorization:`Bearer ${localStorage.getItem('token')||''}`});}
  getShows():Observable<Show[]>{return this.http.get<Show[]>(this.apiUrl);}
  getShowById(id:number):Observable<Show>{return this.http.get<Show>(`${this.apiUrl}/${id}`);}
  createShow(show:Partial<Show>):Observable<any>{return this.http.post(this.apiUrl,show,{headers:this.headers()});}
  updateShow(id:number,show:Partial<Show>):Observable<any>{return this.http.put(`${this.apiUrl}/${id}`,show,{headers:this.headers()});}
  deleteShow(id:number):Observable<any>{return this.http.delete(`${this.apiUrl}/${id}`,{headers:this.headers()});}
}
