import { Component, OnInit } from '@angular/core';
import { LoanService, LoanApplication } from '../services/loan.service';
import { UserService } from '../services/user.service';

interface LoanStats {
  count: number;
  total: number;
  profit: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showLoginModal = false;
  totalMembers = 0;
  activeLoans = 0;
  totalLoanValue = 0;
  outstandingBalance = 0;
  totalProfit = 0;
  totalRepayment = 0;
  totalValueGiven = 0;
  totalRepaymentExpected = 0;
  loanStatsByType: { [key: string]: LoanStats } = {};
  transactions: LoanApplication[] = [];
  chamaId!: number;
  error: string | null = null;

  constructor(private loanService: LoanService, private userService: UserService) {}

  ngOnInit() {
    this.chamaId = Number(localStorage.getItem('activeChamaId'));
    if (!this.chamaId) {
      this.error = '❌ No active chama selected. Please choose one to view dashboard.';
      return;
    }
    this.loadDashboardData();
  }

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  loadDashboardData(): void {
    this.loanService.getAllApplications(this.chamaId).subscribe({
      next: (loans) => {
        this.userService.getAllMembers(this.chamaId).subscribe({
          next: (members) => this.totalMembers = members?.length || 0,
          error: () => this.totalMembers = 0
        });

        this.loanService.getActiveLoanCount(this.chamaId).subscribe({
          next: (count) => this.activeLoans = count,
          error: () => this.activeLoans = 0
        });

        this.loanService.getTotalLoanValue(this.chamaId).subscribe({
          next: (total) => this.totalLoanValue = total,
          error: () => this.totalLoanValue = 0
        });

        this.loanService.getOutstandingBalance(this.chamaId).subscribe({
          next: (balance) => this.outstandingBalance = balance,
          error: () => this.outstandingBalance = 0
        });

        this.totalValueGiven = loans.reduce((total, loan) => total + (loan.amount || 0), 0);
        this.totalRepaymentExpected = loans.reduce((total, loan) => total + (loan.totalRepayment || 0), 0);
        this.totalProfit = loans.reduce((profit, loan) => profit + ((loan.totalRepayment || 0) - (loan.amount || 0)), 0);
        this.totalRepayment = loans
          .filter(loan => loan.status?.toUpperCase() === 'APPROVED')
          .reduce((sum, loan) => sum + (loan.amount || 0), 0);

        this.transactions = loans.slice(-5).reverse();

        this.loanService.getLoanStatsByType(this.chamaId).subscribe({
          next: (stats) => this.loanStatsByType = stats,
          error: () => this.loanStatsByType = {}
        });
      },
      error: () => this.error = '❌ Failed to fetch dashboard data.'
    });
  }
}
