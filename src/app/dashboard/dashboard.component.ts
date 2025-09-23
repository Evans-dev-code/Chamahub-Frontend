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
        // ✅ Total members in chama
        this.userService.getAllMembers(this.chamaId).subscribe({
          next: (members) => {
            this.totalMembers = members.length;
          },
          error: (err: any) => console.error('Error fetching members:', err)
        });

        this.loanService.getActiveLoanCount(this.chamaId).subscribe({
          next: (activeLoansCount) => this.activeLoans = activeLoansCount,
          error: (err: any) => console.error('Error fetching active loan count:', err)
        });

        this.loanService.getTotalLoanValue(this.chamaId).subscribe({
          next: (totalLoanValue) => this.totalLoanValue = totalLoanValue,
          error: (err: any) => console.error('Error fetching total loan value:', err)
        });

        this.loanService.getOutstandingBalance(this.chamaId).subscribe({
          next: (outstandingBalance) => this.outstandingBalance = outstandingBalance,
          error: (err: any) => console.error('Error fetching outstanding balance:', err)
        });

        // ✅ Calculations from current chama loans
        this.totalValueGiven = loans.reduce((total, loan) => total + (loan.amount || 0), 0);

        this.totalRepaymentExpected = loans.reduce((total, loan) => {
          const expectedRepayment = loan.totalRepayment || 0;
          return total + expectedRepayment;
        }, 0);

        this.totalProfit = loans.reduce((profit, loan) => {
          const amount = loan.amount || 0;
          const totalRepayment = loan.totalRepayment || 0;
          return profit + (totalRepayment - amount);
        }, 0);

        this.totalRepayment = loans
          .filter(loan => loan.status?.toUpperCase() === 'APPROVED')
          .reduce((sum, loan) => sum + (loan.amount || 0), 0);

        // ✅ Recent transactions for this chama
        this.transactions = loans.slice(-5).reverse();

        // ✅ Loan stats by type
        this.loanService.getLoanStatsByType(this.chamaId).subscribe({
          next: (stats) => this.loanStatsByType = stats,
          error: (err: any) => console.error('Error fetching loan stats by type:', err)
        });
      },
      error: (err: any) => {
        console.error('Error fetching loans:', err);
        this.error = '❌ Failed to fetch dashboard data.';
      }
    });
  }
}
