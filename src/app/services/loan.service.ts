import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// ------------------ Interfaces ------------------
export interface LoanApplication {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  amount: number;
  duration: number;
  purpose: string;
  loanType: string;
  salary: number;
  personalLoanInfo?: string;
  mortgagePropertyValue?: number;
  interestRate?: number;
  totalRepayment?: number;
  status?: string;
  createdAt?: string;
  userId?: number;
  username?: string;
  remainingBalance: number;
}

export interface LoanStats {
  count: number;
  total: number;
  profit: number;
}

export interface LoanPayment {
  id?: number;
  loanId: number;
  amountPaid: number;
  paidByUserId: number;
  paymentDate?: string;
  paidByAdmin: boolean;
}

// ------------------ Service ------------------
@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private baseUrl = 'http://localhost:8080/api';
  private userApiUrl = `${this.baseUrl}/user/loan-applications`;
  private adminApiUrl = `${this.baseUrl}/admin/loan-applications`;
  private userPaymentUrl = `${this.baseUrl}/user/payments`;
  private adminPaymentUrl = `${this.baseUrl}/admin/payments`;

  constructor(private http: HttpClient) {}

  // ✅ Submit loan application (chama-specific)
  submitApplication(application: LoanApplication, chamaId: number): Observable<LoanApplication> {
    return this.http.post<LoanApplication>(
      `${this.userApiUrl}?chamaId=${chamaId}`,
      application
    );
  }

  // ✅ Get user's loan applications in chama
  getUserApplications(chamaId: number): Observable<LoanApplication[]> {
    return this.http.get<LoanApplication[]>(`${this.userApiUrl}?chamaId=${chamaId}`);
  }

  // ✅ Get all loan applications in chama (admin view)
  getAllApplications(chamaId: number): Observable<LoanApplication[]> {
    return this.http.get<LoanApplication[]>(`${this.adminApiUrl}?chamaId=${chamaId}`);
  }

  // ✅ Update loan status
  updateLoanStatus(id: number, status: string, chamaId: number): Observable<LoanApplication> {
    const params = new HttpParams()
      .set('status', status.toUpperCase())
      .set('chamaId', chamaId);
    return this.http.put<LoanApplication>(`${this.adminApiUrl}/${id}/status`, {}, { params });
  }

  // ✅ Search by email/phone
  searchByIdentifier(identifier: string, chamaId: number): Observable<LoanApplication[]> {
    return this.getAllApplications(chamaId).pipe(
      map(apps =>
        apps.filter(app =>
          app.email.toLowerCase() === identifier.toLowerCase() ||
          app.phone === identifier
        )
      )
    );
  }

  // ------------------ Stats ------------------
  getTotalLoanValue(chamaId: number): Observable<number> {
    return this.getAllApplications(chamaId).pipe(
      map(loans => loans.reduce((sum, app) => sum + (app.amount || 0), 0))
    );
  }

  getOutstandingBalance(chamaId: number): Observable<number> {
    return this.getAllApplications(chamaId).pipe(
      map(loans =>
        loans.reduce((sum, app) => {
          const repayment = app.totalRepayment || 0;
          const amount = app.amount || 0;
          return sum + (repayment - amount);
        }, 0)
      )
    );
  }

  getActiveLoanCount(chamaId: number): Observable<number> {
    return this.getAllApplications(chamaId).pipe(
      map(loans =>
        loans.filter(app => app.status?.toUpperCase() === 'APPROVED').length
      )
    );
  }

  getLoanStatsByType(chamaId: number): Observable<{ [type: string]: LoanStats }> {
    return this.getAllApplications(chamaId).pipe(
      map((applications: LoanApplication[]) => {
        const stats: { [key: string]: LoanStats } = {};
        applications.forEach(app => {
          const type = app.loanType || 'Unknown';
          const amount = app.amount || 0;
          const interest = ((app.interestRate || 0) / 100) * amount;
          const repayment = app.totalRepayment || 0;
          const profit = repayment - amount;

          if (!stats[type]) {
            stats[type] = { count: 0, total: 0, profit: 0 };
          }

          stats[type].count++;
          stats[type].total += amount;
          stats[type].profit += profit + interest;
        });
        return stats;
      })
    );
  }

  // ------------------ Payments ------------------
  makeUserPayment(payment: LoanPayment, chamaId: number): Observable<any> {
    return this.http.post(`${this.userPaymentUrl}?chamaId=${chamaId}`, payment);
  }

  makeAdminPayment(payment: LoanPayment, chamaId: number): Observable<any> {
    return this.http.post(`${this.adminPaymentUrl}?chamaId=${chamaId}`, payment);
  }

  getPaymentsByLoanId(loanId: number, chamaId: number): Observable<LoanPayment[]> {
    return this.http.get<LoanPayment[]>(`${this.adminPaymentUrl}/loan/${loanId}?chamaId=${chamaId}`);
  }

  getTotalPaidForLoan(loanId: number, chamaId: number): Observable<number> {
    return this.http.get<number>(`${this.userPaymentUrl}/loan/${loanId}/total-paid?chamaId=${chamaId}`);
  }
}
