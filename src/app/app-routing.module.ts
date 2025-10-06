import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LoanApplicationComponent } from './loan-application/loan-application.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';

import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { LoanApprovalComponent } from './loan-approval/loan-approval.component';
import { ViewLoanStatusComponent } from './view-loan-status/view-loan-status.component';
import { AdminLoanPaymentComponent } from './admin-loan-payment/admin-loan-payment.component';
import { UserLoanPaymentComponent } from './user-loan-payment/user-loan-payment.component';
import { SelectChamaComponent } from './select-chama/select-chama.component';
import { ChamaManagementComponent } from './chama-management/chama-management.component';
import { UserContributionsComponent } from './components/user-contributions/user-contributions.component';
import { ContributionsAdminComponent } from './components/contributions-admin/contributions-admin.component';
import { ChamaRulesComponent } from './components/chama-rules/chama-rules.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { InviteAdminComponent } from './auth/invite-admin/invite-admin.component';
import { AcceptInviteComponent } from './auth/accept-invite/accept-invite.component';

const routes: Routes = [
  // Auth routes (no guard)
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'invite-accept', component: AcceptInviteComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // Admin routes (includes both admin and super-admin)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'chama-management', component: ChamaManagementComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'contributions-admin', component: ContributionsAdminComponent },
      { path: 'chama-rules', component: ChamaRulesComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'loan-approval', component: LoanApprovalComponent },
      { path: 'admin-loan-payment', component: AdminLoanPaymentComponent },
      
      // Super-admin only routes
      { path: 'invite-admin', component: InviteAdminComponent, canActivate: [SuperAdminGuard] }
    ]
  },

  // User routes
  {
    path: '',
    component: UserLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'select-chama', component: SelectChamaComponent },
      { path: 'user-dashboard', component: UserDashboardComponent },
      { path: 'user-contributions', component: UserContributionsComponent },
      { path: 'loan-application', component: LoanApplicationComponent },
      { path: 'view-loan-status', component: ViewLoanStatusComponent },
      { path: 'user-loan-payment', component: UserLoanPaymentComponent }
    ]
  },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
