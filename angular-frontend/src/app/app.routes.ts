import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Movies } from './pages/movies/movies';
import { MovieDetails } from './pages/movie-details/movie-details';
import { Cinemas } from './pages/cinemas/cinemas';
import { Shows } from './pages/shows/shows';
import { Booking } from './pages/booking/booking';
import { Bookings } from './pages/bookings/bookings';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'movies',
    component: Movies
  },
  {
    path: 'movies/:id',
    component: MovieDetails
  },
  {
    path: 'cinemas',
    component: Cinemas
  },
  {
    path: 'shows',
    component: Shows
  },
  {
    path: 'booking',
    component: Booking
  },
  {
    path: 'bookings',
    component: Bookings
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'signup',
    component: Signup
  },
  {
    path: '**',
    redirectTo: ''
  }
];