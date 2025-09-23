import { Component, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'loan-management-system';
  showNavbar = true;
  private routerSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Hide navbar on login & signup pages
        const authRoutes = ['/login', '/signup'];
        this.showNavbar = !authRoutes.some(route => event.url.includes(route));
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.getRole() === 'admin';
  }

  // Cleanup subscription to avoid memory leaks
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
