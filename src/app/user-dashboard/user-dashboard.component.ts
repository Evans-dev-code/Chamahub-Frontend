import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoanService, LoanApplication } from '../services/loan.service';
import { ContributionService } from '../services/contribution.service';
import { MemberPayoutDTO } from '../models/member-payout.dto';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  // ===== Loan Calculator =====
  loanAmount: number = 0;
  interestRate: number = 0;
  loanTerm: number = 0;
  monthlyPayment: number | null = null;
  isModalOpen = false;

  // ===== Chama Data =====
  chamaId: number | null = null;
  applications: LoanApplication[] = [];

  // ===== Stats =====
  totalContributions: number = 0;
  activeLoans: number = 0;
  nextDueDate: Date | null = null;
  chamaBalance: number = 0;

  // ===== Loading & Error States =====
  loadingStats: boolean = false;
  statsError: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loanService: LoanService,
    private contributionService: ContributionService
  ) {}

  ngOnInit(): void {
    this.chamaId = Number(localStorage.getItem('activeChamaId'));
    if (this.chamaId) {
      this.getApplications();
      this.loadStats();
    }
  }

  // ===== Loan Calculator Logic =====
  calculateLoan() {
    if (this.loanAmount > 0 && this.interestRate > 0 && this.loanTerm > 0) {
      const monthlyRate = this.interestRate / 100 / 12;
      const numberOfPayments = this.loanTerm * 12;
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

  // ===== Auth =====
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ===== Applications =====
  getApplications() {
    if (!this.chamaId) return;
    this.loanService.getUserApplications(this.chamaId).subscribe({
      next: (apps) => (this.applications = apps),
      error: (err) => console.error('Error loading applications', err)
    });
  }

  // ===== Stats =====
  loadStats(): void {
    if (!this.chamaId) return;
    this.loadingStats = true;
    this.statsError = null;

    const userId = this.authService.getUserId(); // ✅ Get current logged-in user's ID

    // ✅ 1. User’s total contributions
    this.contributionService.getContributionsByMember(this.chamaId, undefined, userId).subscribe({
      next: (contributions) => {
        this.totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);
      },
      error: () => (this.statsError = 'Failed to load user contributions')
    });

    // ✅ 2. Active loans (user-based)
    this.loanService.getUserApplications(this.chamaId).subscribe({
      next: (apps) => (this.activeLoans = apps.filter(a => a.status === 'APPROVED').length),
      error: () => (this.statsError = 'Failed to load loans')
    });

   // ✅ 3. Next payout (from chama data)
this.contributionService.getNextPayout(this.chamaId).subscribe({
  next: (payout: MemberPayoutDTO) => {
    const userId = this.authService.getUserId();

    // Check if the current user is the one who will receive the next payout
    if (payout && payout.nextPayoutMemberId === userId) {
      this.nextDueDate = payout.payoutDate ? new Date(payout.payoutDate) : null;
    } else {
      this.nextDueDate = null;
    }

    this.loadingStats = false;
  },
  error: () => {
    this.statsError = 'Failed to load payout info';
    this.loadingStats = false;
  }
});


    // ✅ 4. Group total balance (all members combined)
    this.contributionService.getContributionsByChama(this.chamaId).subscribe({
      next: (contributions) => {
        this.chamaBalance = contributions.reduce((sum, c) => sum + c.amount, 0);
      },
      error: () => (this.statsError = 'Failed to load balance')
    });
  }
}
