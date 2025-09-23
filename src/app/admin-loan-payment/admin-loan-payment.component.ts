import { Component, OnInit } from '@angular/core';
import { LoanService, LoanPayment, LoanApplication } from '../services/loan.service';

@Component({
  selector: 'app-admin-loan-payment',
  templateUrl: './admin-loan-payment.component.html',
  styleUrls: ['./admin-loan-payment.component.scss']
})
export class AdminLoanPaymentComponent implements OnInit {
  approvedLoans: LoanApplication[] = [];
  selectedLoan: LoanApplication | null = null;
  amountPaid: number = 0;
  paymentSuccess: boolean = false;
  paymentError: string | null = null;
  chamaId!: number;

  // ✅ new state
  paymentHistory: LoanPayment[] = [];
  loadingHistory: boolean = false;

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.chamaId = Number(localStorage.getItem('activeChamaId'));
    if (!this.chamaId) {
      this.paymentError = '❌ No active Chama selected. Please go back and select one.';
      return;
    }
    this.loadApprovedLoans();
  }

  loadApprovedLoans(): void {
    this.loanService.getAllApplications(this.chamaId).subscribe({
      next: loans => {
        this.approvedLoans = loans.filter(
          loan => loan.status?.toUpperCase() === 'APPROVED'
        );
      },
      error: err => {
        this.paymentError = 'Failed to load loan applications.';
        console.error(err);
      }
    });
  }

  // ✅ load payment history when a loan is chosen
  onLoanSelected(): void {
    if (!this.selectedLoan) return;
    this.loadingHistory = true;
    this.loanService.getPaymentsByLoanId(this.selectedLoan.id, this.chamaId).subscribe({
      next: history => {
        this.paymentHistory = history;
        this.loadingHistory = false;
      },
      error: err => {
        console.error('Error fetching payment history', err);
        this.paymentHistory = [];
        this.loadingHistory = false;
      }
    });
  }

  makeAdminPayment(): void {
    if (!this.selectedLoan || this.amountPaid <= 0) {
      this.paymentError = 'Provide a valid loan and payment amount.';
      return;
    }

    const payment: LoanPayment = {
      loanId: this.selectedLoan.id,
      paidByUserId: this.selectedLoan.userId!,
      amountPaid: this.amountPaid,
      paidByAdmin: true
    };

    this.loanService.makeAdminPayment(payment, this.chamaId).subscribe({
      next: () => {
        this.paymentSuccess = true;
        this.paymentError = null;
        this.amountPaid = 0;

        // refresh payment history & loans
        this.onLoanSelected();
        this.loadApprovedLoans();
      },
      error: (err) => {
        this.paymentError = 'Admin payment failed.';
        console.error(err);
      }
    });
  }
}
