import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLoanPaymentComponent } from './user-loan-payment.component';

describe('UserLoanPaymentComponent', () => {
  let component: UserLoanPaymentComponent;
  let fixture: ComponentFixture<UserLoanPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserLoanPaymentComponent]
    });
    fixture = TestBed.createComponent(UserLoanPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
