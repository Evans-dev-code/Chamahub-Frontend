import { Component, OnInit } from '@angular/core';
import { LoanService, LoanApplication } from '../services/loan.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-loan-status',
  templateUrl: './view-loan-status.component.html',
  styleUrls: ['./view-loan-status.component.scss']
})
export class ViewLoanStatusComponent implements OnInit {
  userApplications: LoanApplication[] = [];
  paidMap: { [loanId: number]: number } = {};
  loading = true;
  hasApplications = false;
  chamaId!: number;

  constructor(private loanService: LoanService, private router: Router) {}

  ngOnInit(): void {
    // ✅ fetch active chamaId from localStorage
    this.chamaId = Number(localStorage.getItem('activeChamaId'));
    if (!this.chamaId) {
      alert('No active Chama selected. Please go back and select one.');
      this.router.navigate(['/user-dashboard']);
      return;
    }

    this.fetchUserApplications();
  }

  private fetchUserApplications(): void {
    this.loading = true;
    this.loanService.getUserApplications(this.chamaId).subscribe({
      next: (applications) => {
        this.userApplications = applications || [];
        this.hasApplications = this.userApplications.length > 0;
        this.loading = false;

        // Fetch paid amounts for each loan
        this.userApplications.forEach(app => {
          this.loanService.getTotalPaidForLoan(app.id, this.chamaId).subscribe({
            next: (paid) => {
              this.paidMap[app.id] = paid ?? 0;
            },
            error: (err) => {
              console.error(`Failed to fetch paid amount for loan ${app.id}:`, err);
              this.paidMap[app.id] = 0;
            }
          });
        });
      },
      error: (err) => {
        console.error('Failed to fetch user applications:', err);
        this.userApplications = [];
        this.hasApplications = false;
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/user-dashboard']);
  }

  getTotalRepayment(app: LoanApplication): number {
    return app.totalRepayment ?? 0;
  }

  getPaidAmount(appId: number): number {
    return this.paidMap[appId] ?? 0;
  }

  getOutstandingBalance(app: LoanApplication): number {
    const total = this.getTotalRepayment(app);
    const paid = this.getPaidAmount(app.id);
    const balance = total - paid;
    return balance >= 0 ? balance : 0;
  }

  getProgressPercent(app: LoanApplication): number {
    const total = this.getTotalRepayment(app);
    const paid = this.getPaidAmount(app.id);
    const percent = total > 0 ? Math.floor((paid / total) * 100) : 0;
    return percent > 100 ? 100 : percent;
  }
}
