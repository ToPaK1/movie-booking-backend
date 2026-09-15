import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Cinema, CinemasService } from '../../core/services/cinemas';
import { ShowsService, Show } from '../../core/services/shows';
import { Movie, MovieService } from '../../core/services/movie';

@Component({selector:'app-cinema-details',imports:[CommonModule,RouterLink],templateUrl:'./cinema-details.html',styleUrl:'./cinema-details.css'})
export class CinemaDetails implements OnInit {
  private route=inject(ActivatedRoute); private cinemasService=inject(CinemasService); private showsService=inject(ShowsService); private movieService=inject(MovieService);
  cinema=signal<Cinema|null>(null); shows=signal<Show[]>([]); movies=signal<Movie[]>([]); loading=signal(true); error=signal('');

  ngOnInit():void{
    const id=Number(this.route.snapshot.paramMap.get('id'));
    if(!id){this.error.set('Invalid cinema ID.');this.loading.set(false);return}

    forkJoin({cinema:this.cinemasService.getCinemaById(id),shows:this.showsService.getShows(),movies:this.movieService.getMovies()}).subscribe({
      next:r=>{
        this.cinema.set(r.cinema);
        this.movies.set(r.movies);
        if(r.cinema.status==='locked'){
          this.shows.set([]);
        }else{
          this.shows.set(r.shows.filter(s=>s.cinema_id===id).filter(s=>new Date(`${s.show_date}T${s.show_time}`).getTime()>=Date.now()));
        }
        this.loading.set(false);
      },
      error:()=>{this.error.set('Cinema schedule could not be loaded.');this.loading.set(false)}
    });
  }

  movie(show:Show):Movie|undefined{return this.movies().find(m=>m.id===show.movie_id)}
  formatDate(v:string):string{return new Date(`${v}T12:00:00`).toLocaleDateString('en-EG',{weekday:'short',month:'short',day:'numeric'})}
  formatTime(v:string):string{return new Date(`2026-01-01T${v}`).toLocaleTimeString('en-EG',{hour:'numeric',minute:'2-digit'})}
}
