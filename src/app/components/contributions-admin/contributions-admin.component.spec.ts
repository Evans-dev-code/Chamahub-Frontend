import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContributionComponent } from './contributions-admin.component';

describe('AdminContributionComponent', () => {
  let component: AdminContributionComponent;
  let fixture: ComponentFixture<AdminContributionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminContributionComponent]
    });
    fixture = TestBed.createComponent(AdminContributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
