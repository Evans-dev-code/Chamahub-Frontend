import { Component, OnInit } from '@angular/core';
import { ContributionService } from '../../services/contribution.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ContributionDTO } from '../../models/contribution.dto';
import { ContributionOwedDTO } from '../../models/contribution-owed.dto';
import { PaymentConfirmDialogComponent } from '../payment-confirm-dialog/payment-confirm-dialog.component';

@Component({
  selector: 'app-user-contributions',
  templateUrl: './user-contributions.component.html',
  styleUrls: ['./user-contributions.component.scss']
})
export class UserContributionsComponent implements OnInit {
  contributions: ContributionDTO[] = [];
  owedInfo: ContributionOwedDTO | null = null;
  loading = false;
  paymentLoading = false;
  totalContributed = 0;
  chamaId: number | null = null;

  displayedColumns: string[] = ['cycle', 'amount', 'datePaid', 'status', 'penalty'];

  constructor(
    private contributionService: ContributionService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.chamaId = Number(localStorage.getItem('activeChamaId'));
    if (!this.chamaId) {
      this.snackBar.open('No active chama selected', 'Close', { duration: 3000 });
      return;
    }

    this.loadContributions();
    this.loadOwedAmount();
  }

  /** Load member contributions */
  loadContributions(): void {
    if (!this.chamaId) return;

    this.loading = true;
    this.contributionService.getContributionsByMember(this.chamaId).subscribe({
      next: (res) => {
        this.contributions = res;
        this.calculateTotalContributed();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading contributions:', err);
        this.snackBar.open('Failed to load contributions', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  /** Load owed amount for member */
  loadOwedAmount(): void {
    if (!this.chamaId) return;

    this.contributionService.getOwedAmount(this.chamaId).subscribe({
      next: (res) => this.owedInfo = res,
      error: (err) => {
        console.error('Error loading owed amount:', err);
        this.snackBar.open('Failed to load owed amount', 'Close', { duration: 3000 });
      }
    });
  }

  /** Calculate total contributions */
  calculateTotalContributed(): void {
    this.totalContributed = this.contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
  }

  /** Status color mapping */
  getStatusColor(status: string): string {
    switch (status) {
      case 'ON_TIME': return 'success';
      case 'LATE': return 'warn';
      case 'PENDING': return 'accent';
      default: return '';
    }
  }

  /** Refresh contributions and owed amount */
  refreshData(): void {
    this.loadContributions();
    this.loadOwedAmount();
  }

  /** Open payment confirmation dialog */
  openPaymentForm(info: ContributionOwedDTO): void {
    if (!this.chamaId) return;

    const dialogRef = this.dialog.open(PaymentConfirmDialogComponent, {
      width: '400px',
      data: { amount: info.amountOwed, cycle: info.currentCycle }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) this.makePayment(info);
    });
  }

  /** Make contribution payment */
  private makePayment(info: ContributionOwedDTO): void {
    if (!this.chamaId) return;

    this.paymentLoading = true;

    const payment: ContributionDTO = {
      id: 0, // backend assigns memberId from JWT
      memberId: 0,
      chamaId: this.chamaId,
      amount: info.amountOwed,
      cycle: info.currentCycle,
      datePaid: new Date().toISOString().split('T')[0],
      status: 'ON_TIME',
      penaltyAmount: info.penaltyAmount || 0
    };

    this.contributionService.addContribution(payment).subscribe({
      next: () => {
        this.snackBar.open('Contribution successful!', 'Close', { duration: 3000 });
        this.refreshData();
        this.paymentLoading = false;
      },
      error: (err) => {
        console.error('Error making contribution:', err);
        this.snackBar.open('Payment failed. Try again.', 'Close', { duration: 3000 });
        this.paymentLoading = false;
      }
    });
  }
}
