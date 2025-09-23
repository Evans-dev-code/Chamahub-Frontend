import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectChamaComponent } from './select-chama.component';

describe('SelectChamaComponent', () => {
  let component: SelectChamaComponent;
  let fixture: ComponentFixture<SelectChamaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectChamaComponent]
    });
    fixture = TestBed.createComponent(SelectChamaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
