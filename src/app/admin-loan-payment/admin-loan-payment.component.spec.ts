import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLoanPaymentComponent } from './admin-loan-payment.component';

describe('AdminLoanPaymentComponent', () => {
  let component: AdminLoanPaymentComponent;
  let fixture: ComponentFixture<AdminLoanPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminLoanPaymentComponent]
    });
    fixture = TestBed.createComponent(AdminLoanPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
