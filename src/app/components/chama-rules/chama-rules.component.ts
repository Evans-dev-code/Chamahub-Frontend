import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContributionService } from '../../services/contribution.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChamaRulesDTO } from '../../models/chama-rules.dto';

@Component({
  selector: 'app-chama-rules',
  templateUrl: './chama-rules.component.html',
  styleUrls: ['./chama-rules.component.scss']
})
export class ChamaRulesComponent implements OnInit {
  rulesForm: FormGroup;
  loading = false;
  saving = false;
  chamaId: number | null = null;
  existingRules: ChamaRulesDTO | null = null;
  isEditMode = false;

  cycleTypes = [
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' }
  ];

  constructor(
    private fb: FormBuilder,
    private contributionService: ContributionService,
    private snackBar: MatSnackBar
  ) {
    this.rulesForm = this.createForm();
  }

  ngOnInit(): void {
    this.chamaId = Number(localStorage.getItem('activeChamaId'));
    if (!this.chamaId) {
      this.snackBar.open('No active chama selected', 'Close', { duration: 3000 });
      return;
    }
    this.loadExistingRules();
  }

  createForm(): FormGroup {
    return this.fb.group({
      monthlyContributionAmount: [0, [Validators.required, Validators.min(1)]],
      penaltyForLate: [0, [Validators.required, Validators.min(0)]],
      cycleType: ['MONTHLY', Validators.required],
      dayOfCycle: [1, [Validators.required, Validators.min(1), Validators.max(31)]],
      gracePeriodDays: [0, [Validators.required, Validators.min(0), Validators.max(30)]]
    });
  }

  loadExistingRules(): void {
    if (!this.chamaId) return;

    this.loading = true;
    this.contributionService.getChamaRules(this.chamaId).subscribe({
      next: (rules) => {
        this.existingRules = rules;
        this.isEditMode = true;
        this.populateForm(rules);
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 404 || error.error?.includes('not found')) {
          this.isEditMode = false; // no rules yet
        } else {
          console.error('Error loading chama rules:', error);
          this.snackBar.open('Error loading existing rules', 'Close', { duration: 3000 });
        }
        this.loading = false;
      }
    });
  }

  populateForm(rules: ChamaRulesDTO): void {
    this.rulesForm.patchValue({
      monthlyContributionAmount: rules.monthlyContributionAmount,
      penaltyForLate: rules.penaltyForLate,
      cycleType: rules.cycleType,
      dayOfCycle: rules.dayOfCycle,
      gracePeriodDays: rules.gracePeriodDays
    });
  }

  onCycleTypeChange(): void {
    const cycleType = this.rulesForm.get('cycleType')?.value;
    const dayOfCycleControl = this.rulesForm.get('dayOfCycle');

    if (cycleType === 'WEEKLY') {
      dayOfCycleControl?.setValidators([Validators.required, Validators.min(1), Validators.max(7)]);
    } else {
      dayOfCycleControl?.setValidators([Validators.required, Validators.min(1), Validators.max(31)]);
    }
    dayOfCycleControl?.updateValueAndValidity();
  }

  getDayOfCycleLabel(): string {
    const cycleType = this.rulesForm.get('cycleType')?.value;
    return cycleType === 'WEEKLY' ? 'Day of Week (1=Monday, 7=Sunday)' : 'Day of Month (1-31)';
  }

  onSubmit(): void {
    if (this.rulesForm.invalid || !this.chamaId) {
      this.markFormGroupTouched();
      return;
    }

    this.saving = true;
    const formData = this.rulesForm.value;
    const dto: ChamaRulesDTO = {
      ...formData,
      chamaId: this.chamaId
    };

    // Always use POST for create/update
    this.contributionService.createOrUpdateChamaRules(dto).subscribe({
      next: (result) => {
        this.existingRules = result;
        this.isEditMode = true;
        this.saving = false;
        this.snackBar.open('Chama rules saved successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error saving chama rules:', error);
        this.snackBar.open('Error saving chama rules', 'Close', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  resetForm(): void {
    if (this.existingRules) {
      this.populateForm(this.existingRules);
    } else {
      this.rulesForm.reset({
        monthlyContributionAmount: 0,
        penaltyForLate: 0,
        cycleType: 'MONTHLY',
        dayOfCycle: 1,
        gracePeriodDays: 0
      });
    }
    this.markFormGroupUntouched();
  }

  deleteRules(): void {
    if (!this.chamaId || !this.existingRules) return;

    if (confirm('Are you sure you want to delete these chama rules? This action cannot be undone.')) {
      this.contributionService.deleteChamaRules(this.chamaId).subscribe({
        next: () => {
          this.existingRules = null;
          this.isEditMode = false;
          this.resetForm();
          this.snackBar.open('Chama rules deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting chama rules:', error);
          this.snackBar.open('Error deleting chama rules', 'Close', { duration: 3000 });
        }
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.rulesForm.controls).forEach(key => {
      this.rulesForm.get(key)?.markAsTouched();
    });
  }

  private markFormGroupUntouched(): void {
    Object.keys(this.rulesForm.controls).forEach(key => {
      this.rulesForm.get(key)?.markAsUntouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.rulesForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${fieldName} is required`;
      if (control.errors['min']) return `${fieldName} must be at least ${control.errors['min'].min}`;
      if (control.errors['max']) return `${fieldName} cannot exceed ${control.errors['max'].max}`;
    }
    return '';
  }
}
