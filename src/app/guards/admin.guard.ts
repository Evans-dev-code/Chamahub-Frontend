import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const role = this.authService.getRole()?.toLowerCase();  // Normalize here
    const isAuthenticated = this.authService.isAuthenticated();

    console.log('🔐 AdminGuard - Role:', role, '| Authenticated:', isAuthenticated);

    if (isAuthenticated && role === 'admin') {
  return true;
} else {
  console.warn('🚫 Access denied. Redirecting...');
  if (isAuthenticated) {
    // Normal user
    this.router.navigate(['/select-chama']);
  } else {
    // Not logged in
    this.router.navigate(['/login']);
  }
  return false;
}
  }
}
