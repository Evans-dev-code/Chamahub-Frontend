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
    const activeChama = localStorage.getItem('activeChamaId');

    // ✅ Redirect to select-chama if no chama is chosen
    if (!activeChama && !url.includes('select-chama')) {
      console.warn('⚠️ No active chama. Redirecting to select-chama.');
      this.router.navigate(['/select-chama']);
      return false;
    }

    return true;
  }
}
