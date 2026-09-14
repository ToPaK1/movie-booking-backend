import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, AuthUser } from '../../core/services/auth';
import { BookingService, Booking } from '../../core/services/booking';

@Component({ selector:'app-profile', imports:[CommonModule,RouterLink], templateUrl:'./profile.html', styleUrl:'./profile.css' })
export class Profile implements OnInit {
  private auth=inject(AuthService); private bookingService=inject(BookingService);
  user=signal<AuthUser|null>(null); bookings=signal<Booking[]>([]); loading=signal(true);
  ngOnInit():void{this.user.set(this.auth.getUser());this.bookingService.getMyBookings().subscribe({next:b=>{this.bookings.set(b);this.loading.set(false)},error:()=>this.loading.set(false)});}
  get totalSpent():number{return this.bookings().reduce((sum,b)=>sum+Number(b.total_price||0),0)}
}
