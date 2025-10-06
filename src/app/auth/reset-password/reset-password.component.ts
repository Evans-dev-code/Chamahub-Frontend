import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  message = '';
  loading = false;
  success = false;

  showPassword = false;
  showConfirmPassword = false;

  strengthMessage = '';
  strengthClass = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkPasswordStrength(): void {
    const password = this.resetForm.get('newPassword')?.value || '';

    if (password.length < 6) {
      this.strengthMessage = 'Weak';
      this.strengthClass = 'weak';
    } else if (password.match(/[A-Z]/) && password.match(/[0-9]/)) {
      this.strengthMessage = 'Strong';
      this.strengthClass = 'strong';
    } else {
      this.strengthMessage = 'Medium';
      this.strengthClass = 'medium';
    }
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.message = 'Please fill in all fields correctly.';
      return;
    }

    const { newPassword, confirmPassword } = this.resetForm.value;

    if (newPassword !== confirmPassword) {
      this.message = 'Passwords do not match.';
      return;
    }

    if (!this.token) {
      this.message = 'Invalid or missing reset token.';
      return;
    }

    this.loading = true;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (res: string) => {
        this.loading = false;
        this.success = true;
        this.message = '✅ Password has been successfully reset!';
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.success = false;
        this.message =
          err.error?.message || '❌ Failed to reset password. Please try again.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
