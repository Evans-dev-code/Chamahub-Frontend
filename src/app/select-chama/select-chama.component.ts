// src/app/select-chama/select-chama.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chama, ChamaService } from '../services/chama.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-select-chama',
  templateUrl: './select-chama.component.html',
  styleUrls: ['./select-chama.component.scss']
})
export class SelectChamaComponent implements OnInit {
  chamas: Chama[] = [];
  joinCode: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private chamaService: ChamaService, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadChamas();
  }

  loadChamas(): void {
    this.loading = true;
    this.chamaService.getMyChamas().subscribe({
      next: data => {
        this.chamas = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load your Chamas.';
        this.loading = false;
      }
    });
  }

  enterChama(chama: Chama): void {
    localStorage.setItem('activeChamaId', chama.id.toString());
    this.router.navigate(['/user-dashboard']);
  }

  joinChama(): void {
    if (!this.joinCode.trim()) return;

    this.loading = true;
    this.chamaService.joinChama(this.joinCode).subscribe({
      next: (newChama: Chama) => {
        localStorage.setItem('activeChamaId', newChama.id.toString());
        this.router.navigate(['/user-dashboard']);
      },
      error: err => {
        this.errorMessage = err.error || 'Failed to join chama.';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
