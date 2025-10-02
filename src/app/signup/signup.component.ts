import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

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
  showPassword: { [key: string]: boolean } = {};
  passwordStrengthPercent = 0;
  passwordStrengthClass = '';
  usernameAvailable: boolean | null = null;
  emailAvailable: boolean | null = null;

  fields: FieldConfig[] = [
    { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
    { name: 'username', label: 'Username', type: 'text', placeholder: 'johndoe' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
    { name: 'userId', label: 'User ID', type: 'text', placeholder: 'B001' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••' }
  ];

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      userId: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });

    // Password strength meter
    this.signupForm.get('password')?.valueChanges.subscribe(value => this.calculatePasswordStrength(value));

    // Real-time availability
    this.signupForm.get('username')?.valueChanges.pipe(
      debounceTime(500),
      switchMap(value => value ? this.authService.checkUsernameAvailability(value) : of({ available: null })),
      map(res => res.available)
    ).subscribe(available => this.usernameAvailable = available);

    this.signupForm.get('email')?.valueChanges.pipe(
      debounceTime(500),
      switchMap(value => value ? this.authService.checkEmailAvailability(value) : of({ available: null })),
      map(res => res.available)
    ).subscribe(available => this.emailAvailable = available);
  }

  passwordsMatch(form: AbstractControl) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { passwordMismatch: true };
  }

  isPasswordField(name: string) {
    return name === 'password' || name === 'confirmPassword';
  }

  toggleShowPassword(name: string) {
    this.showPassword[name] = !this.showPassword[name];
  }

  calculatePasswordStrength(password: string) {
    let score = 0;
    if (!password) score = 0;
    if (password.length >= 6) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[\W]/.test(password)) score += 25;

    this.passwordStrengthPercent = score;
    if (score <= 25) this.passwordStrengthClass = 'weak';
    else if (score <= 50) this.passwordStrengthClass = 'fair';
    else if (score <= 75) this.passwordStrengthClass = 'good';
    else this.passwordStrengthClass = 'strong';
  }

  showError(controlName: string) {
    const control = this.signupForm.get(controlName);
    return !!(control?.invalid && (control.touched || control.dirty));
  }

  getErrorMessage(controlName: string): string {
    const control = this.signupForm.get(controlName);
    if (control?.hasError('required')) return `${this.pretty(controlName)} is required.`;
    if (control?.hasError('minlength')) return `${this.pretty(controlName)} must be at least ${control.getError('minlength').requiredLength} characters.`;
    if (controlName === 'email' && control?.hasError('email')) return 'Enter a valid email.';
    if (controlName === 'confirmPassword' && this.signupForm.hasError('passwordMismatch')) return 'Passwords do not match.';
    if (controlName === 'username' && this.usernameAvailable === false) return 'Username is already taken.';
    if (controlName === 'email' && this.emailAvailable === false) return 'Email is already registered.';
    return '';
  }

  pretty(name: string) {
    return name.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  }

  onSignUp() {
    if (this.signupForm.invalid || this.usernameAvailable === false || this.emailAvailable === false) {
      this.signupForm.markAllAsTouched();
      return;
    }
    const { fullName, username, email, userId, password } = this.signupForm.value;
    const payload = { fullName, username, email, userId, password, role: 'USER' };

    this.authService.signup(payload).subscribe({
      next: res => {
        alert(res.message || 'Signup successful! Welcome to your Chama!');
        this.router.navigate(['/login']);
      },
      error: err => alert(err.error?.message || 'Signup failed. Please try again.')
    });
  }
}
