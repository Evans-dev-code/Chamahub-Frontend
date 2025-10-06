import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  message: string = '';
  loading: boolean = false;
  success: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.message = 'Please enter a valid email address.';
      return;
    }

    this.loading = true;
    this.message = '';

    const email = this.forgotForm.value.email;

    this.authService.forgotPassword(email).subscribe({
      next: (res: string) => {
        this.loading = false;
        this.success = true;
        this.message = 'If the email exists, a password reset link has been sent.';
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.success = false;
        this.message = err.error?.message || 'Something went wrong. Please try again.';
      }
    });
  }
}
