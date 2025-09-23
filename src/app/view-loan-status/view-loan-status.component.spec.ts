import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLoanStatusComponent } from './view-loan-status.component';

describe('ViewLoanStatusComponent', () => {
  let component: ViewLoanStatusComponent;
  let fixture: ComponentFixture<ViewLoanStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewLoanStatusComponent]
    });
    fixture = TestBed.createComponent(ViewLoanStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
