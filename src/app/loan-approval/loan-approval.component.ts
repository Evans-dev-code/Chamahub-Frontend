import { Component, OnInit } from '@angular/core';
import { LoanService, LoanApplication } from '../services/loan.service';
import { ChamaService, Chama } from '../services/chama.service';

@Component({
  selector: 'app-loan-approval',
  templateUrl: './loan-approval.component.html',
  styleUrls: ['./loan-approval.component.scss']
})
export class LoanApprovalComponent implements OnInit {
  applications: LoanApplication[] = [];
  loading: boolean = false;
  error: string = '';

  chamas: Chama[] = [];
  selectedChamaId: number | null = null;

  constructor(
    private loanService: LoanService,
    private chamaService: ChamaService
  ) {}

  ngOnInit(): void {
    this.loadChamas();
  }

  // ✅ Load all chamas for logged-in user
  loadChamas(): void {
    this.chamaService.getMyChamas().subscribe({
      next: (data: Chama[]) => {
        this.chamas = data;
        if (this.chamas.length > 0) {
          this.selectedChamaId = this.chamas[0].id; // default to first chama
          this.loadApplications();
        }
      },
      error: () => {
        this.error = 'Error loading chamas';
      }
    });
  }

  // ✅ Load applications for selected chama
  loadApplications(): void {
    if (!this.selectedChamaId) return;
    this.loading = true;
    this.loanService.getAllApplications(this.selectedChamaId).subscribe({
      next: (data: LoanApplication[]) => {
        this.applications = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error loading applications';
        this.loading = false;
      }
    });
  }

  // ✅ Approve loan
  approve(app: LoanApplication): void {
    if (!app.id || !this.selectedChamaId) return;
    this.loanService.updateLoanStatus(app.id, 'approved', this.selectedChamaId).subscribe({
      next: () => this.loadApplications(),
      error: () => (this.error = 'Error updating application status')
    });
  }

  // ✅ Reject loan
  reject(app: LoanApplication): void {
    if (!app.id || !this.selectedChamaId) return;
    this.loanService.updateLoanStatus(app.id, 'rejected', this.selectedChamaId).subscribe({
      next: () => this.loadApplications(),
      error: () => (this.error = 'Error updating application status')
    });
  }

  getTotalRepayment(app: LoanApplication): number {
    return app.totalRepayment ?? 0;
  }
}
