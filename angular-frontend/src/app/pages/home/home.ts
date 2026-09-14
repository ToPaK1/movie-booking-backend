import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  title = signal('Welcome to CineBook');

  subtitle = signal(
    'Book your favorite movies, choose your cinema, and enjoy the show.'
  );

  featuredMovies = signal([
    {
      id: 1,
      title: 'Inception',
      genre: 'Sci-Fi',
      rating: 8.8
    },
    {
      id: 2,
      title: 'The Dark Knight',
      genre: 'Action',
      rating: 9.0
    },
    {
      id: 3,
      title: 'Interstellar',
      genre: 'Sci-Fi',
      rating: 8.7
    }
  ]);

}