import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService, Booking } from '../../core/services/booking';
@Component({selector:'app-payment',imports:[CommonModule,FormsModule,RouterLink],templateUrl:'./payment.html',styleUrl:'./payment.css'})
export class Payment implements OnInit{
 private route=inject(ActivatedRoute);private router=inject(Router);private service=inject(BookingService);booking=signal<Booking|null>(null);loading=signal(true);paying=signal(false);error=signal('');card='';
 ngOnInit():void{const id=Number(this.route.snapshot.paramMap.get('id'));if(!id){this.error.set('Booking not found.');this.loading.set(false);return;}this.service.getBookingById(id).subscribe({next:b=>{this.booking.set(b);this.loading.set(false)},error:()=>{this.error.set('Unable to load checkout.');this.loading.set(false)}})}
 pay():void{if(!this.booking()||this.paying())return;this.paying.set(true);setTimeout(()=>{this.paying.set(false);this.router.navigate(['/booking-confirmation',this.booking()!.id])},900)}
}
