import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly menuOpen = signal(false);

  toggleMenu(): void { this.menuOpen.update(open => !open); }
  closeMenu(): void { this.menuOpen.set(false); }

  logout(): void {
    this.closeMenu();
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
