import { Component, OnInit } from '@angular/core';
import { LoanService, LoanApplication, LoanPayment } from '../services/loan.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-loan-payment',
  templateUrl: './user-loan-payment.component.html',
  styleUrls: ['./user-loan-payment.component.scss']
})
export class UserLoanPaymentComponent implements OnInit {
  approvedLoans: LoanApplication[] = [];
  paymentStatus: { [loanId: number]: string } = {};
  paymentAmount: { [loanId: number]: number } = {};
  isLoading: boolean = false;
  chamaId!: number; // ✅ active chama

  constructor(
    private loanService: LoanService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.chamaId = Number(localStorage.getItem('activeChamaId'));
    if (!this.chamaId) {
      alert('No active Chama selected. Please go back and select one.');
      this.router.navigate(['/user-dashboard']);
      return;
    }

    this.loadUserLoans();
  }

  loadUserLoans(): void {
    this.isLoading = true;
    this.loanService.getUserApplications(this.chamaId).subscribe({
      next: loans => {
        this.approvedLoans = loans.filter(loan => loan.status?.toUpperCase() === 'APPROVED');
        this.isLoading = false;
      },
      error: err => {
        console.error('Failed to load user loans', err);
        this.isLoading = false;
      }
    });
  }

  makePayment(loanId: number): void {
    const amount = this.paymentAmount[loanId];

    if (!amount || amount <= 0) {
      this.paymentStatus[loanId] = '❌ Please enter a valid amount.';
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.paymentStatus[loanId] = '❌ User not authenticated. Please log in again.';
      return;
    }

    const payment: LoanPayment = {
      loanId: loanId,
      amountPaid: amount,
      paidByUserId: userId,
      paidByAdmin: false
    };

    this.isLoading = true;

    this.loanService.makeUserPayment(payment, this.chamaId).subscribe({
      next: () => {
        this.paymentStatus[loanId] = '✅ Payment successful!';
        this.paymentAmount[loanId] = 0;
        this.loadUserLoans(); // refresh balances
      },
      error: err => {
        const errorMessage = err?.error?.message || err?.message || 'Payment failed. Try again later.';
        this.paymentStatus[loanId] = `❌ ${errorMessage}`;
        console.error('Payment failed:', err);
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/user-dashboard']);
  }
}
