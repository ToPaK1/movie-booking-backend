import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService, Movie } from '../../core/services/movie';
import { BookingService, Booking } from '../../core/services/booking';
import { ShowsService, Show } from '../../core/services/shows';
import { CinemasService, Cinema } from '../../core/services/cinemas';

@Component({selector:'app-admin',imports:[CommonModule],templateUrl:'./admin.html',styleUrl:'./admin.css'})
export class Admin implements OnInit{
 private moviesService=inject(MovieService); private bookingsService=inject(BookingService); private showsService=inject(ShowsService); private cinemasService=inject(CinemasService);
 movies=signal<Movie[]>([]); bookings=signal<Booking[]>([]); shows=signal<Show[]>([]); cinemas=signal<Cinema[]>([]); loading=signal(true); message=signal('');
 ngOnInit():void{this.refresh();}
 refresh():void{this.loading.set(true);this.moviesService.getMovies().subscribe({next:m=>this.movies.set(m)});this.showsService.getShows().subscribe({next:s=>this.shows.set(s)});this.cinemasService.getCinemas().subscribe({next:c=>this.cinemas.set(c)});this.bookingsService.getAllBookings().subscribe({next:b=>{this.bookings.set(b);this.loading.set(false)},error:()=>this.loading.set(false)});}
 get revenue():number{return this.bookings().reduce((n,b)=>n+Number(b.total_price||0),0)}
 get tickets():number{return this.bookings().reduce((n,b)=>n+b.seats_booked,0)}
 deleteMovie(movie:Movie):void{if(!confirm(`Delete ${movie.title}?`))return;this.moviesService.deleteMovie(movie.id).subscribe({next:()=>{this.message.set('Movie deleted successfully.');this.refresh()},error:e=>this.message.set(e.error?.message||'Delete failed.')}})}
}
