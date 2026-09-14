import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Booking, BookingService } from '../../core/services/booking';

@Component({ selector:'app-bookings', imports:[CommonModule,RouterLink], templateUrl:'./bookings.html', styleUrl:'./bookings.css' })
export class Bookings implements OnInit {
  private bookingService=inject(BookingService); private router=inject(Router);
  bookings=signal<Booking[]>([]); loading=signal(true); errorMessage=signal(''); successMessage=signal('');
  ngOnInit():void{this.loadBookings();}
  loadBookings():void{
    if(!localStorage.getItem('token')){this.router.navigate(['/login']);return;}
    this.loading.set(true); this.errorMessage.set('');
    this.bookingService.getMyBookings().subscribe({next:b=>{this.bookings.set(b||[]);this.loading.set(false);},error:e=>{this.loading.set(false);if(e.status===401){localStorage.removeItem('token');localStorage.removeItem('user');this.router.navigate(['/login']);return;}this.errorMessage.set(e.error?.message||'Failed to load your bookings.');}});
  }
  deleteBooking(id:number):void{if(!window.confirm('Are you sure you want to cancel this booking?'))return;this.bookingService.deleteBooking(id).subscribe({next:r=>{this.successMessage.set(r?.message||'Booking cancelled successfully.');this.loadBookings();},error:e=>this.errorMessage.set(e.error?.message||'Failed to cancel booking.')});}
  refreshBookings():void{this.loadBookings();}
}