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
  filteredChamas: Chama[] = [];

  joinCode: string = '';
  searchTerm: string = '';
  filterType: string = '';

  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private chamaService: ChamaService,
    private router: Router,
    private authService: AuthService
  ) {}

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.loadChamas();
  }

  /** 🔄 Load all user chamas */
  loadChamas(): void {
    this.loading = true;
    this.errorMessage = '';

    this.chamaService.getMyChamas().subscribe({
      next: data => {
        this.chamas = data;
        this.filteredChamas = [...this.chamas]; // copy for filtering
        this.loading = false;
      },
      error: () => {
        this.errorMessage = '❌ Failed to load your Chamas.';
        this.loading = false;
      }
    });
  }

  /** 🎯 Enter chama */
  enterChama(chama: Chama): void {
    localStorage.setItem('activeChamaId', chama.id.toString());
    localStorage.setItem('activeChamaName', chama.name || '');
    localStorage.setItem('activeChamaDescription', chama.description || '');
    this.router.navigate(['/user-dashboard']);
  }

  /** 🔑 Join chama via code */
  joinChama(): void {
    if (!this.joinCode.trim()) return;

    this.loading = true;
    this.errorMessage = '';

    this.chamaService.joinChama(this.joinCode).subscribe({
      next: (newChama: Chama) => {
        localStorage.setItem('activeChamaId', newChama.id.toString());
        localStorage.setItem('activeChamaName', newChama.name || '');
        localStorage.setItem('activeChamaDescription', newChama.description || '');
        this.router.navigate(['/user-dashboard']);
      },
      error: err => {
        this.errorMessage = err.error?.message || '❌ Failed to join chama.';
        this.loading = false;
      }
    });
  }

  filterChamas(): void {
  this.filteredChamas = this.chamas.filter(chama =>
    chama.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}


  /** 🚪 Logout */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /** ➕ Only for admins: Create new chama */
  createChama(): void {
    if (!this.isAdmin) return;
    this.router.navigate(['/chama-management']);
  }
}
