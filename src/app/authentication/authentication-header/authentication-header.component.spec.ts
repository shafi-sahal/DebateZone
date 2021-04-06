import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationHeaderComponent } from './authentication-header.component';

describe('AuthenticationHeaderComponent', () => {
  let component: AuthenticationHeaderComponent;
  let fixture: ComponentFixture<AuthenticationHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthenticationHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
