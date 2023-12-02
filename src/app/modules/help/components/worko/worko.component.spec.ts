import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoComponent } from './worko.component';

describe('WorkoComponent', () => {
  let component: WorkoComponent;
  let fixture: ComponentFixture<WorkoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkoComponent]
    });
    fixture = TestBed.createComponent(WorkoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
