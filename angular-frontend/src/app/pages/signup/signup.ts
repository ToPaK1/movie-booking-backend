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
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  private readonly apiUrl = 'http://localhost:3000/api/auth';

  signup(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.name.trim() || !this.email.trim() || !this.password || !this.confirmPassword) {
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters.');
      return;
    }

    const email = this.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.errorMessage.set('Please enter a valid email address.');
      return;
    }

    this.loading.set(true);
    this.http.post<any>(`${this.apiUrl}/signup`, {
      name: this.name.trim(), email, password: this.password, phone: this.phone.trim()
    }).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage.set(response?.message || 'Account created successfully!');
        setTimeout(() => this.router.navigate(['/verify-email'], { queryParams: { email } }), 900);
      },
      error: (error) => {
        this.loading.set(false);
        if (error.status === 409) {
          this.errorMessage.set('This email is already registered.');
        } else {
          this.errorMessage.set(error.error?.message || 'Something went wrong. Please try again.');
        }
      }
    });
  }
}