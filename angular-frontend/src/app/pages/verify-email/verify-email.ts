import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-email',
  imports: [FormsModule, RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css'
})
export class VerifyEmail implements OnInit {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  email = '';
  code = '';

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  private apiUrl = 'http://localhost:3000/api/auth';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });

    if (!this.email) {
      this.errorMessage.set(
        'Email address is missing. Please register again.'
      );
    }
  }

  verifyEmail(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.email) {
      this.errorMessage.set('Email address is missing.');
      return;
    }

    if (!this.code.trim()) {
      this.errorMessage.set('Please enter the verification code.');
      return;
    }

    if (!/^\d{6}$/.test(this.code.trim())) {
      this.errorMessage.set(
        'Verification code must be 6 digits.'
      );
      return;
    }

    this.loading.set(true);

    this.http.post<any>(
      `${this.apiUrl}/verify-email`,
      {
        email: this.email,
        code: this.code.trim()
      }
    ).subscribe({

      next: (response) => {
        this.loading.set(false);

        this.successMessage.set(
          response?.message ||
          'Email verified successfully!'
        );

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },

      error: (error) => {
        this.loading.set(false);

        console.error('Email verification error:', error);

        if (error.status === 400) {
          this.errorMessage.set(
            error.error?.message ||
            'Invalid or expired verification code.'
          );
        } else if (error.status === 404) {
          this.errorMessage.set(
            'User not found.'
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