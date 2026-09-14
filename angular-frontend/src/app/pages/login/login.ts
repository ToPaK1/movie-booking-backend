
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private http = inject(HttpClient);
  private router = inject(Router);

  email = '';
  password = '';

  loading = signal(false);
  errorMessage = signal('');

  private apiUrl = 'http://localhost:3000/api/auth';

  login(): void {

    this.errorMessage.set('');

    if (!this.email || !this.password) {
      this.errorMessage.set(
        'Please enter your email and password.'
      );
      return;
    }

    this.loading.set(true);

    this.http.post<any>(
      `${this.apiUrl}/login`,
      {
        email: this.email,
        password: this.password
      }
    ).subscribe({

      next: (response) => {

        this.loading.set(false);

        /*
         * Save JWT token
         */
        localStorage.setItem(
          'token',
          response.token
        );

        /*
         * Save logged-in user
         */
        if (response.user) {
          localStorage.setItem(
            'user',
            JSON.stringify(response.user)
          );
        }

        /*
         * Go back to shows after login
         */
        this.router.navigate(['/shows']);
      },

      error: (error) => {

        this.loading.set(false);

        console.error(
          'Login error:',
          error
        );

        if (error.status === 401) {

          this.errorMessage.set(
            'Invalid email or password.'
          );

        } else if (error.status === 429) {

          this.errorMessage.set(
            'Too many login attempts. Please try again later.'
          );

        } else {

          this.errorMessage.set(
            'Something went wrong. Please try again.'
          );
        }
      }
    });
  }
}
