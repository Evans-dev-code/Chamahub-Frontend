import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChamaRulesComponent } from './chama-rules.component';

describe('ChamaRulesComponent', () => {
  let component: ChamaRulesComponent;
  let fixture: ComponentFixture<ChamaRulesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChamaRulesComponent]
    });
    fixture = TestBed.createComponent(ChamaRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
