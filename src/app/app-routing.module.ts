import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'; // Admin Dashboard
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './signup/signup.component'; 
import { LoanApplicationComponent } from './loan-application/loan-application.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AdminGuard } from './guards/admin.guard'; // Admin Guard
import { AuthGuard } from './guards/auth.guard'; // Authentication Guard
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { LoanApprovalComponent } from './loan-approval/loan-approval.component';
import { ViewLoanStatusComponent } from './view-loan-status/view-loan-status.component';
import { AdminLoanPaymentComponent } from './admin-loan-payment/admin-loan-payment.component';
import { UserLoanPaymentComponent } from './user-loan-payment/user-loan-payment.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { SelectChamaComponent } from './select-chama/select-chama.component';
import { ChamaManagementComponent } from './chama-management/chama-management.component';
import { UserContributionsComponent } from './components/user-contributions/user-contributions.component';
import { ContributionsAdminComponent } from './components/contributions-admin/contributions-admin.component';
import { ChamaRulesComponent } from './components/chama-rules/chama-rules.component';

const routes: Routes = [
  // ---------------- Public Auth ----------------
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  {
  path: '',
  component: MainLayoutComponent, 
  canActivate: [AdminGuard],
  children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'contributions-admin', component: ContributionsAdminComponent },
    { path: 'chama-rules', component: ChamaRulesComponent },
    { path: 'user-management', component: UserManagementComponent },
    { path: 'loan-approval', component: LoanApprovalComponent },
    { path: 'admin-loan-payment', component: AdminLoanPaymentComponent },
    { path:'chama-management', component: ChamaManagementComponent },
    { path: '', redirectTo: 'chama-management', pathMatch: 'full' } 
  ]
},

  // ---------------- User Panel ----------------
  {
    path: '',
    component: UserLayoutComponent, 
    canActivate: [AuthGuard],
    children: [
      { path: 'select-chama', component: SelectChamaComponent }, // 👈 must select/join chama
      { path: 'user-dashboard', component: UserDashboardComponent },
      { path: 'user-contributions', component: UserContributionsComponent },
      { path: 'loan-application', component: LoanApplicationComponent },
      { path: 'view-loan-status', component: ViewLoanStatusComponent },
      { path: 'user-loan-payment', component: UserLoanPaymentComponent },
      { path: '', redirectTo: 'select-chama', pathMatch: 'full' } // 👈 default after login
    ]
  },

  // ---------------- Wildcard ----------------
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
