import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanService, LoanApplication } from '../services/loan.service';

@Component({
  selector: 'app-loan-application',
  templateUrl: './loan-application.component.html',
  styleUrls: ['./loan-application.component.scss']
})
export class LoanApplicationComponent implements OnInit {
  loanForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loanService: LoanService
  ) {}

  ngOnInit() {
    this.loanForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      amount: ['', [Validators.required, Validators.min(500)]],
      duration: ['', Validators.required],
      purpose: ['', Validators.required],
      loanType: ['', Validators.required],
      salary: [''],
      personalLoanInfo: [''],
      mortgagePropertyValue: [''],
      interestRate: [{ value: '', disabled: true }],
      totalRepayment: [{ value: '', disabled: true }]
    });

    // react to changes
    this.loanForm.get('loanType')?.valueChanges.subscribe(() => {
      this.updateDynamicValidators();
      this.calculateRepayment();
    });

    this.loanForm.get('duration')?.valueChanges.subscribe(() => {
      this.calculateRepayment();
    });

    this.loanForm.get('amount')?.valueChanges.subscribe(() => {
      this.calculateRepayment();
    });
  }

  updateDynamicValidators() {
    const type = this.loanForm.get('loanType')?.value;
    const salaryControl = this.loanForm.get('salary');
    const personalLoanInfoControl = this.loanForm.get('personalLoanInfo');
    const mortgagePropertyValueControl = this.loanForm.get('mortgagePropertyValue');

    if (type === 'business' || type === 'auto') {
      salaryControl?.setValidators([Validators.required, Validators.min(1000)]);
    } else {
      salaryControl?.clearValidators();
    }

    if (type === 'personal') {
      personalLoanInfoControl?.setValidators([Validators.required]);
    } else {
      personalLoanInfoControl?.clearValidators();
    }

    if (type === 'mortgage') {
      mortgagePropertyValueControl?.setValidators([Validators.required, Validators.min(50000)]);
    } else {
      mortgagePropertyValueControl?.clearValidators();
    }

    salaryControl?.updateValueAndValidity();
    personalLoanInfoControl?.updateValueAndValidity();
    mortgagePropertyValueControl?.updateValueAndValidity();
  }

  calculateRepayment() {
    const amount = +this.loanForm.get('amount')?.value;
    const duration = +this.loanForm.get('duration')?.value;
    const loanType = this.loanForm.get('loanType')?.value;

    let rate = 10;
    if (loanType === 'personal') {
      rate = duration > 12 ? 12 : 10;
    } else if (loanType === 'business') {
      rate = duration > 24 ? 15 : 13;
    } else if (loanType === 'mortgage') {
      rate = 6;
    } else if (loanType === 'auto') {
      rate = duration > 24 ? 9 : 7;
    }

    this.loanForm.get('interestRate')?.setValue(rate);

    if (amount && duration && rate) {
      const interest = (amount * (rate / 100) * (duration / 12));
      const total = amount + interest;
      this.loanForm.get('totalRepayment')?.setValue(total.toFixed(2));
    } else {
      this.loanForm.get('totalRepayment')?.setValue('');
    }
  }

  applyLoan() {
    this.submitted = true;
    if (this.loanForm.valid) {
      // ✅ get chamaId from localStorage
      const chamaId = Number(localStorage.getItem('activeChamaId'));

      if (!chamaId) {
        alert('No active Chama selected. Please go back and select one.');
        return;
      }

      const application: LoanApplication = this.loanForm.getRawValue();

      this.loanService.submitApplication(application, chamaId).subscribe({
        next: () => {
          alert('Loan Application Submitted Successfully!');
          this.resetForm();
        },
        error: (err) => {
          alert('There was an error submitting your loan application.');
          console.error(err);
        }
      });
    }
  }

  private resetForm() {
    this.loanForm.reset();
    this.submitted = false;

    Object.keys(this.loanForm.controls).forEach(key => {
      const control = this.loanForm.get(key);
      if (control) {
        control.setErrors(null);
        control.markAsPristine();
        control.markAsUntouched();
      }
    });
  }

  validateNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '');
  }

  onLoanTypeChange() {
    console.log('Loan Type changed:', this.loanForm.value.loanType);
  }

  goBack(): void {
    this.router.navigate(['/user-dashboard']);
  }
}
