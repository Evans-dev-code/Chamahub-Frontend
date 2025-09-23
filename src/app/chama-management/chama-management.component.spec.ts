import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChamaManagementComponent } from './chama-management.component';

describe('ChamaManagementComponent', () => {
  let component: ChamaManagementComponent;
  let fixture: ComponentFixture<ChamaManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChamaManagementComponent]
    });
    fixture = TestBed.createComponent(ChamaManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
