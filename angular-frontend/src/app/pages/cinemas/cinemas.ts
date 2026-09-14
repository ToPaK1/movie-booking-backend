import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cinema, CinemasService } from '../../core/services/cinemas';

@Component({ selector:'app-cinemas', imports:[RouterLink], templateUrl:'./cinemas.html', styleUrl:'./cinemas.css' })
export class Cinemas implements OnInit {
  private readonly cinemasService=inject(CinemasService); cinemas=signal<Cinema[]>([]); loading=signal(true); error=signal('');
  ngOnInit():void{this.loadCinemas();}
  loadCinemas():void{this.loading.set(true);this.error.set('');this.cinemasService.getCinemas().subscribe({next:data=>{this.cinemas.set(data);this.loading.set(false)},error:err=>{console.error(err);this.cinemas.set([]);this.error.set('Failed to load cinemas.');this.loading.set(false)}});}
}
