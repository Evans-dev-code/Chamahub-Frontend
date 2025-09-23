import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserContributionsComponent } from './user-contributions.component';

describe('UserContributionsComponent', () => {
  let component: UserContributionsComponent;
  let fixture: ComponentFixture<UserContributionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserContributionsComponent]
    });
    fixture = TestBed.createComponent(UserContributionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
