import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService, Movie } from '../../core/services/movie';
import { BookingService, Booking } from '../../core/services/booking';
import { ShowsService, Show } from '../../core/services/shows';
import { CinemasService, Cinema } from '../../core/services/cinemas';

@Component({ selector:'app-admin', imports:[CommonModule,FormsModule], templateUrl:'./admin.html', styleUrl:'./admin.css' })
export class Admin implements OnInit {
  private moviesService=inject(MovieService); private bookingsService=inject(BookingService); private showsService=inject(ShowsService); private cinemasService=inject(CinemasService);
  movies=signal<Movie[]>([]); bookings=signal<Booking[]>([]); shows=signal<Show[]>([]); cinemas=signal<Cinema[]>([]); loading=signal(true); message=signal(''); editingId=signal<number|null>(null); editingCinemaId=signal<number|null>(null); editingShowId=signal<number|null>(null);
  form:Partial<Movie>={title:'',description:'',genre:'',duration:120,release_date:'',rating:8,poster:''};
  cinemaForm:Partial<Cinema>={name:'',location:'',total_seats:150};
  showForm:Partial<Show>={movie_id:0,cinema_id:0,show_date:'',show_time:'18:00',available_seats:150,ticket_price:150};

  ngOnInit():void{this.refresh();}
  refresh():void{this.loading.set(true);this.moviesService.getMovies().subscribe({next:x=>this.movies.set(x),error:()=>{}});this.showsService.getShows().subscribe({next:x=>this.shows.set(x),error:()=>{}});this.cinemasService.getCinemas().subscribe({next:x=>this.cinemas.set(x),error:()=>{}});this.bookingsService.getAllBookings().subscribe({next:x=>{this.bookings.set(x);this.loading.set(false)},error:()=>this.loading.set(false)});}
  toNumber(value:unknown):number{const n=Number(value);return Number.isFinite(n)?n:0;}
  get revenue():number{return this.bookings().reduce((t,b)=>t+this.toNumber(b.total_price),0)}
  get tickets():number{return this.bookings().reduce((t,b)=>t+this.toNumber(b.seats_booked),0)}
  movieRevenue(title:string):number{return this.bookings().filter(b=>b.movie_title===title).reduce((t,b)=>t+this.toNumber(b.total_price),0)}
  revenuePercentage(v:number):number{return this.revenue>0?v/this.revenue*100:0}

  editMovie(movie:Movie):void{this.editingId.set(movie.id);this.form={...movie};window.scrollTo({top:0,behavior:'smooth'});}
  resetForm():void{this.editingId.set(null);this.form={title:'',description:'',genre:'',duration:120,release_date:'',rating:8,poster:''};}
  saveMovie():void{if(!this.form.title||!this.form.genre){this.message.set('Title and genre are required.');return}const request=this.editingId()?this.moviesService.updateMovie(this.editingId()!,this.form):this.moviesService.createMovie(this.form);request.subscribe({next:()=>{this.message.set(this.editingId()?'Movie updated successfully.':'Movie created successfully.');this.resetForm();this.refresh()},error:e=>this.message.set(e.error?.message||'Could not save movie.')});}
  deleteMovie(movie:Movie):void{if(!confirm(`Delete ${movie.title}?`))return;this.moviesService.deleteMovie(movie.id).subscribe({next:()=>{this.message.set('Movie deleted successfully.');this.refresh()},error:e=>this.message.set(e.error?.message||'Delete failed.')});}

  editCinema(cinema:Cinema):void{this.editingCinemaId.set(cinema.id);this.cinemaForm={...cinema};}
  resetCinema():void{this.editingCinemaId.set(null);this.cinemaForm={name:'',location:'',total_seats:150};}
  saveCinema():void{if(!this.cinemaForm.name||!this.cinemaForm.location){this.message.set('Cinema name and location are required.');return}const req=this.editingCinemaId()?this.cinemasService.updateCinema(this.editingCinemaId()!,this.cinemaForm):this.cinemasService.createCinema(this.cinemaForm);req.subscribe({next:()=>{this.message.set(this.editingCinemaId()?'Cinema updated successfully.':'Cinema created successfully.');this.resetCinema();this.refresh()},error:e=>this.message.set(e.error?.message||'Could not save cinema.')});}
  deleteCinema(cinema:Cinema):void{if(!confirm(`Delete ${cinema.name}?`))return;this.cinemasService.deleteCinema(cinema.id).subscribe({next:()=>{this.message.set('Cinema deleted successfully.');this.refresh()},error:e=>this.message.set(e.error?.message||'Delete failed.')});}

  editShow(show:Show):void{this.editingShowId.set(show.id);this.showForm={...show};}
  resetShow():void{this.editingShowId.set(null);this.showForm={movie_id:this.movies()[0]?.id||0,cinema_id:this.cinemas()[0]?.id||0,show_date:'',show_time:'18:00',available_seats:150,ticket_price:150};}
  saveShow():void{if(!this.showForm.movie_id||!this.showForm.cinema_id||!this.showForm.show_date||!this.showForm.show_time){this.message.set('Movie, cinema, date and time are required.');return}const req=this.editingShowId()?this.showsService.updateShow(this.editingShowId()!,this.showForm):this.showsService.createShow(this.showForm);req.subscribe({next:()=>{this.message.set(this.editingShowId()?'Show updated successfully.':'Show created successfully.');this.resetShow();this.refresh()},error:e=>this.message.set(e.error?.message||'Could not save show.')});}
  deleteShow(show:Show):void{if(!confirm(`Delete show #${show.id}?`))return;this.showsService.deleteShow(show.id).subscribe({next:()=>{this.message.set('Show deleted successfully.');this.refresh()},error:e=>this.message.set(e.error?.message||'Delete failed.')});}
}
