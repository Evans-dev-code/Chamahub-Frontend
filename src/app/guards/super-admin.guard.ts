import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const role = this.authService.getRole()?.toLowerCase() || '';
    const isAuthenticated = this.authService.isAuthenticated();

    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    if (['superadmin', 'super-admin', 'super_admin'].includes(role)) {
      return true;
    }

    if (role === 'admin') {
      this.router.navigate(['/dashboard']);
      return false;
    }

    if (role === 'user') {
      this.router.navigate(['/select-chama']);
      return false;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
