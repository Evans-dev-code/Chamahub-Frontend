import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoanService, LoanApplication } from '../services/loan.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  loanAmount: number = 0;
  interestRate: number = 0;
  loanTerm: number = 0;
  monthlyPayment: number | null = null;

  isModalOpen = false;
  chamaId: number | null = null;
  applications: LoanApplication[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private loanService: LoanService
  ) {}

  ngOnInit(): void {
    // Grab chamaId from localStorage
    this.chamaId = Number(localStorage.getItem('activeChamaId'));
    if (this.chamaId) {
      this.getApplications();
    }
  }

  calculateLoan() {
    if (this.loanAmount > 0 && this.interestRate > 0 && this.loanTerm > 0) {
      let monthlyRate = this.interestRate / 100 / 12;
      let numberOfPayments = this.loanTerm * 12;
      this.monthlyPayment =
        (this.loanAmount * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
    } else {
      this.monthlyPayment = null;
    }
  }

  resetCalculator() {
    this.loanAmount = 0;
    this.interestRate = 0;
    this.loanTerm = 0;
    this.monthlyPayment = null;
  }

  openModal(event: MouseEvent) {
    event.preventDefault();
    this.resetCalculator();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // 🔹 Load loan applications for the active chama
  getApplications() {
    if (!this.chamaId) return;

    this.loanService.getUserApplications(this.chamaId).subscribe({
      next: (apps) => {
        this.applications = apps;
      },
      error: (err) => {
        console.error('Error loading applications', err);
      }
    });
  }
}
