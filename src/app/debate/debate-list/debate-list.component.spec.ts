import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebateListComponent } from './debate-list.component';

describe('DebateListComponent', () => {
  let component: DebateListComponent;
  let fixture: ComponentFixture<DebateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
