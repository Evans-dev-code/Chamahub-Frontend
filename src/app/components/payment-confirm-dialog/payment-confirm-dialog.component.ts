import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface PaymentConfirmDialogData {
  amount: number;
  cycle: string;
}

@Component({
  selector: 'app-payment-confirm-dialog',
  templateUrl: './payment-confirm-dialog.component.html',
  styleUrls: ['./payment-confirm-dialog.component.scss']
})
export class PaymentConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PaymentConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentConfirmDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
