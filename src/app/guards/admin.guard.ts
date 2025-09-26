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
  const role = this.authService.getRole()?.toLowerCase();
  const isAuthenticated = this.authService.isAuthenticated();

  console.log('🔐 AdminGuard - Checking route:', state.url);
  console.log('   -> Role:', role);
  console.log('   -> Authenticated:', isAuthenticated);

  if (isAuthenticated && role === 'admin') {
    console.log('✅ Access granted to admin route:', state.url);
    return true;
  } else {
    console.warn('🚫 Access denied. Redirecting...');
    if (isAuthenticated) {
      this.router.navigate(['/select-chama']);
    } else {
      this.router.navigate(['/login']);
    }
    return false;
  }
}
}
