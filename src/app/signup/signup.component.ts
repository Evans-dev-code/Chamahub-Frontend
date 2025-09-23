import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface FieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;

  // Define field config for cleaner HTML
  fields: FieldConfig[] = [
    { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
    { name: 'username', label: 'Username', type: 'text', placeholder: 'johndoe' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
    { name: 'userId', label: 'User ID', type: 'text', placeholder: 'B001' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      userId: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(form: AbstractControl) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  showError(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!(control?.invalid && (control.touched || control.dirty));
  }

  getErrorMessage(controlName: string): string {
    const control = this.signupForm.get(controlName);
    if (control?.hasError('required')) return `${this.pretty(controlName)} is required.`;
    if (control?.hasError('minlength')) {
      const min = control.getError('minlength').requiredLength;
      return `${this.pretty(controlName)} must be at least ${min} characters.`;
    }
    if (controlName === 'email' && control?.hasError('email')) return 'Enter a valid email.';
    if (controlName === 'confirmPassword' && this.signupForm.hasError('passwordMismatch')) {
      return 'Passwords do not match.';
    }
    return '';
  }

  pretty(name: string): string {
    return name.replace(/([A-Z])/g, ' $1')
      .replace(/^./, s => s.toUpperCase());
  }

  onSignUp(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { fullName, username, email, userId, password } = this.signupForm.value;
    const payload = { fullName, username, email, userId, password, role: 'USER' };

    this.authService.signup(payload).subscribe({
      next: res => {
        alert(res.message || 'Signup successful!');
        this.router.navigate(['/login']);
      },
      error: err => {
        const msg = err.error?.message || 'Signup failed. Try again.';
        alert(msg);
      }
    });
  }
}
