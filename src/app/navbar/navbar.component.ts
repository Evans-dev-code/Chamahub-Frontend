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
  isAdminUser: boolean = false;
  activeChamaName: string = '';
  activeChamaDescription: string = '';
  activeChamaId: string | null = null;
  myChamas: any[] = []; // you can populate this from a ChamaService
  private routerSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkAdminStatus();
    this.loadActiveChamaInfo();

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.loadActiveChamaInfo());
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  private checkAdminStatus(): void {
    this.isAdminUser = this.authService.isAdmin();
  }

  private loadActiveChamaInfo(): void {
    this.activeChamaId = localStorage.getItem('activeChamaId');
    this.activeChamaName = localStorage.getItem('activeChamaName') || '';
    this.activeChamaDescription = localStorage.getItem('activeChamaDescription') || '';
  }

  switchChama(): void {
    if (this.myChamas.length > 1) {
      this.router.navigate(['/chama-selection']);
    } else {
      console.log('Only one chama available — switch not needed.');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
