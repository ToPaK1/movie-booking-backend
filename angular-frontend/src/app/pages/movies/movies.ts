import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie, MovieService } from '../../core/services/movie';
@Component({selector:'app-movies',imports:[RouterLink],templateUrl:'./movies.html',styleUrl:'./movies.css'})
export class Movies implements OnInit{
 private readonly movieService=inject(MovieService); movies=signal<Movie[]>([]); loading=signal(true); error=signal(''); query=signal(''); genre=signal('All'); minRating=signal(0);
 ngOnInit():void{this.loadMovies();} loadMovies():void{this.loading.set(true);this.error.set('');this.movieService.getMovies().subscribe({next:d=>{this.movies.set(d);this.loading.set(false)},error:()=>{this.movies.set([]);this.error.set('Failed to load movies.');this.loading.set(false)}});}
 genres():string[]{return ['All',...new Set(this.movies().map(m=>m.genre))];}
 filteredMovies():Movie[]{const q=this.query().trim().toLowerCase();return this.movies().filter(m=>(!q||m.title.toLowerCase().includes(q)||m.description?.toLowerCase().includes(q))&&(this.genre()==='All'||m.genre===this.genre())&&Number(m.rating)>=this.minRating());}
}
