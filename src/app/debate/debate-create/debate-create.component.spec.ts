import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebateCreateComponent } from './debate-create.component';

describe('DebateCreateComponent', () => {
  let component: DebateCreateComponent;
  let fixture: ComponentFixture<DebateCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebateCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
