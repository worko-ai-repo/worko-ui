import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeMatchTableComponent } from './resume-match-table.component';

describe('ResumeMatchTableComponent', () => {
  let component: ResumeMatchTableComponent;
  let fixture: ComponentFixture<ResumeMatchTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResumeMatchTableComponent]
    });
    fixture = TestBed.createComponent(ResumeMatchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
