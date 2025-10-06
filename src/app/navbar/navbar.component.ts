import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAdminUser = false;
  isSuperAdminUser = false;
  activeChamaName = '';
  activeChamaDescription = '';
  activeChamaId: string | null = null;
  myChamas: any[] = [];

  private routerSubscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.loadActiveChamaInfo();

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.loadActiveChamaInfo());
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  private checkUserRole(): void {
    const role = this.authService.getRole()?.toLowerCase();
    this.isAdminUser = role === 'admin' || role === 'super_admin';
    this.isSuperAdminUser = role === 'super_admin';
  }

  private loadActiveChamaInfo(): void {
    this.activeChamaId = localStorage.getItem('activeChamaId');
    this.activeChamaName = localStorage.getItem('activeChamaName') || '';
    this.activeChamaDescription = localStorage.getItem('activeChamaDescription') || '';
  }

  switchChama(): void {
    if (this.myChamas.length > 1) {
      this.router.navigate(['/chama-selection']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
