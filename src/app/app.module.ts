import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared.module';

// Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';

// Layouts
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';

// Features
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LoanApplicationComponent } from './loan-application/loan-application.component';
import { LoanApprovalComponent } from './loan-approval/loan-approval.component';
import { ViewLoanStatusComponent } from './view-loan-status/view-loan-status.component';
import { UserLoanPaymentComponent } from './user-loan-payment/user-loan-payment.component';
import { AdminLoanPaymentComponent } from './admin-loan-payment/admin-loan-payment.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { SelectChamaComponent } from './select-chama/select-chama.component';
import { ChamaManagementComponent } from './chama-management/chama-management.component';
import { ChamaRulesComponent } from './components/chama-rules/chama-rules.component';
import { UserContributionsComponent } from './components/user-contributions/user-contributions.component';
import { ContributionsAdminComponent } from './components/contributions-admin/contributions-admin.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PaymentConfirmDialogComponent } from './components/payment-confirm-dialog/payment-confirm-dialog.component';

// Services & Guards
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { LoanService } from './services/loan.service';
import { ChamaService } from './services/chama.service';
import { ContributionService } from './services/contribution.service';
import { AdminGuard } from './guards/admin.guard';
import { AuthInterceptor } from './auth/interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UserDashboardComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    UserLayoutComponent,
    LoginComponent,
    SignupComponent,
    LoanApplicationComponent,
    LoanApprovalComponent,
    ViewLoanStatusComponent,
    UserLoanPaymentComponent,
    AdminLoanPaymentComponent,
    UserManagementComponent,
    SelectChamaComponent,
    ChamaManagementComponent,
    ChamaRulesComponent,
    UserContributionsComponent,
    ContributionsAdminComponent,
    NavbarComponent,
    PaymentConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    RouterModule,
    AppRoutingModule,
    ToastrModule.forRoot()
  ],
  providers: [
    AuthService,
    UserService,
    LoanService,
    ChamaService,
    ContributionService,
    AdminGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
