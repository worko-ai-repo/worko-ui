import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoAuthComponent } from './worko-auth.component';

describe('WorkoAuthComponent', () => {
  let component: WorkoAuthComponent;
  let fixture: ComponentFixture<WorkoAuthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkoAuthComponent]
    });
    fixture = TestBed.createComponent(WorkoAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
