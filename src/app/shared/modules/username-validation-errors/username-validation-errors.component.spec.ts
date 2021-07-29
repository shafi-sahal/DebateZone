import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameValidationErrorsComponent } from './username-validation-errors.component';

describe('UsernameValidationErrorsComponent', () => {
  let component: UsernameValidationErrorsComponent;
  let fixture: ComponentFixture<UsernameValidationErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsernameValidationErrorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsernameValidationErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
