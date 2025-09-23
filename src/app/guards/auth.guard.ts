import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const url = state.url;
    const role = this.authService.getRole()?.toLowerCase();

    // Redirect users to chama selection if required
    if ((role === 'user' || role === 'admin') && !localStorage.getItem('activeChamaId') && !url.includes('chama-selection')) {
      console.warn('⚠️ No active chama. Redirecting to chama-selection.');
      this.router.navigate(['/chama-selection']);
      return false;
    }

    return true;
  }
}
