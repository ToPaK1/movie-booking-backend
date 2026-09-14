import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  email = '';
  password = '';
  loading = signal(false);
  errorMessage = signal('');

  private readonly apiUrl = 'http://localhost:3000/api/auth';

  login(): void {
    this.errorMessage.set('');

    if (!this.email.trim() || !this.password) {
      this.errorMessage.set('Please enter your email and password.');
      return;
    }

    this.loading.set(true);

    this.http.post<any>(`${this.apiUrl}/login`, {
      email: this.email.trim().toLowerCase(),
      password: this.password
    }).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.auth.setSession(response.token, response.user ?? {});
        this.router.navigate(['/shows']);
      },
      error: (error) => {
        this.loading.set(false);
        if (error.status === 401) {
          this.errorMessage.set('Invalid email or password.');
        } else if (error.status === 429) {
          this.errorMessage.set('Too many login attempts. Please try again later.');
        } else {
          this.errorMessage.set('Something went wrong. Please try again.');
        }
      }
    });
  }
}