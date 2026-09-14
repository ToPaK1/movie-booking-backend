import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

  private http = inject(HttpClient);
  private router = inject(Router);

  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  private apiUrl = 'http://localhost:3000/api/auth';

  signup(): void {

    this.errorMessage.set('');
    this.successMessage.set('');

    // Required fields
    if (
      !this.name.trim() ||
      !this.email.trim() ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.errorMessage.set(
        'Please fill in all required fields.'
      );
      return;
    }

    // Password confirmation
    if (this.password !== this.confirmPassword) {
      this.errorMessage.set(
        'Passwords do not match.'
      );
      return;
    }

    // Password length
    if (this.password.length < 6) {
      this.errorMessage.set(
        'Password must be at least 6 characters.'
      );
      return;
    }

    // Email validation
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.email.trim())) {
      this.errorMessage.set(
        'Please enter a valid email address.'
      );
      return;
    }

    this.loading.set(true);

    const userEmail = this.email.trim();

    this.http.post<any>(
      `${this.apiUrl}/signup`,
      {
        name: this.name.trim(),
        email: userEmail,
        password: this.password,
        phone: this.phone.trim()
      }
    ).subscribe({

      next: (response) => {

        this.loading.set(false);

        this.successMessage.set(
          response?.message ||
          'Account created successfully! Please verify your email.'
        );

        // Go to email verification page
        setTimeout(() => {

          this.router.navigate(
            ['/verify-email'],
            {
              queryParams: {
                email: userEmail
              }
            }
          );

        }, 1200);
      },

      error: (error) => {

        this.loading.set(false);

        console.error(
          'Signup error:',
          error
        );

        if (error.status === 400) {

          this.errorMessage.set(
            error.error?.message ||
            'Invalid registration data.'
          );

        } else if (error.status === 409) {

          this.errorMessage.set(
            'This email is already registered.'
          );

        } else {

          this.errorMessage.set(
            error.error?.message ||
            'Something went wrong. Please try again.'
          );
        }
      }
    });
  }
}