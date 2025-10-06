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
  errorMessage = '';
  loginMessage = '';
  loginSuccess = false;
  showPassword = false;
  loading = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid) return;

    this.loading = true;
    this.errorMessage = '';
    this.loginMessage = '';

    const loginData = {
      identifier: this.loginForm.value.usernameOrEmail,
      password: this.loginForm.value.password
    };

    this.authService.login(loginData).subscribe({
      next: (res) => {
        this.loading = false;
        const token = res.token;
        const role = (res.role || 'user').toLowerCase();

        if (!token) {
          this.loginSuccess = false;
          this.loginMessage = 'Login failed: no token received.';
          return;
        }

        this.authService.setAuthToken(token);
        this.authService.setRole(role);

        this.loginSuccess = true;
        this.loginMessage = 'Login successful! Redirecting...';

        // Redirect immediately based on role
        switch (role) {
          case 'super_admin':
          case 'superadmin':
          case 'admin':
          case 'super-admin':
          case 'super_admin':
            this.router.navigate(['/chama-management']);
            break;
          case 'user':
            this.router.navigate(['/select-chama']);
            break;
          default:
            this.router.navigate(['/login']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.loginSuccess = false;
        this.loginMessage = err.error?.message || 'Invalid credentials. Please try again.';
      }
    });
  }
}
