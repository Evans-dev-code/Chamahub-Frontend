import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentConfirmDialogComponent } from './payment-confirm-dialog.component';

describe('PaymentConfirmDialogComponent', () => {
  let component: PaymentConfirmDialogComponent;
  let fixture: ComponentFixture<PaymentConfirmDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentConfirmDialogComponent]
    });
    fixture = TestBed.createComponent(PaymentConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
