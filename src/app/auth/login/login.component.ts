import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loginMessage: string = ''; // For success/error message display
  loginSuccess: boolean = false; // True if login succeeded
  showPassword: boolean = false; // Toggle password visibility
  loading: boolean = false; // Show spinner during login

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true; // Start loading
      this.loginMessage = '';
      this.errorMessage = '';

      const loginData = {
        identifier: this.loginForm.value.usernameOrEmail,
        password: this.loginForm.value.password
      };

      console.log('🚀 Sending login data:', loginData);

      this.authService.login(loginData).subscribe({
        next: (res) => {
          console.log('🔁 Full login response:', res);
          this.loading = false;

          const token = res.token || null;
          const role = (res.role || 'user').toLowerCase();

          if (token) {
            this.authService.setAuthToken(token);
            this.authService.setRole(role);

            this.loginSuccess = true;
            this.loginMessage = 'Login successful! Redirecting...';

            setTimeout(() => {
              if (role === 'admin') {
                console.log('✅ Admin login success! Redirecting to Chama Management...');
                this.router.navigate(['/chama-management']);
              } else if (role === 'user') {
                console.log('✅ User login success! Redirecting to Select Chama...');
                this.router.navigate(['/select-chama']);
              } else {
                console.warn('⚠️ Unknown role:', role);
                this.router.navigate(['/login']);
              }
            }, 1000); // Short delay to show message
          } else {
            console.error('❌ No token received in response!');
            this.loginSuccess = false;
            this.loginMessage = 'Login failed: no token received.';
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('❌ Login error:', err);
          this.loading = false;
          this.loginSuccess = false;
          this.loginMessage = err.error?.message || 'Invalid credentials. Please try again.';
        }
      });
    }
  }
}
