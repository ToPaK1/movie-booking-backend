
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ShowsService, Show } from '../../core/services/shows';

@Component({
  selector: 'app-shows',
  imports: [],
  templateUrl: './shows.html',
  styleUrl: './shows.css'
})
export class Shows implements OnInit {

  private showsService = inject(ShowsService);
  private router = inject(Router);

  shows = signal<Show[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.loadShows();
  }

  loadShows(): void {
    this.loading.set(true);
    this.error.set('');

    this.showsService.getShows().subscribe({
      next: (data) => {
        this.shows.set(data);
        this.loading.set(false);
      },

      error: (error) => {
        console.error('Error loading shows:', error);

        this.error.set(
          'Failed to load shows. Please try again.'
        );

        this.loading.set(false);
      }
    });
  }

  bookNow(showId: number): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/booking'], {
      queryParams: {
        show_id: showId
      }
    });
  }
}
