import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly router = inject(Router);
  pageTheme = 'theme-home';

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.pageTheme = this.getPageTheme(event.urlAfterRedirects);
      });
  }

  private getPageTheme(url: string): string {
    if (url === '/' || url === '') return 'theme-home';
    if (url.startsWith('/movies')) return 'theme-movies';
    if (url.startsWith('/cinemas')) return 'theme-cinemas';
    if (url.startsWith('/shows')) return 'theme-shows';
    if (url.startsWith('/booking') || url.startsWith('/payment')) return 'theme-booking';
    if (url.startsWith('/bookings')) return 'theme-tickets';
    if (url.startsWith('/favorites')) return 'theme-favorites';
    if (url.startsWith('/profile')) return 'theme-profile';
    if (url.startsWith('/admin')) return 'theme-admin';
    if (url.startsWith('/login') || url.startsWith('/signup') || url.startsWith('/verify-email')) return 'theme-auth';
    return 'theme-home';
  }
}
