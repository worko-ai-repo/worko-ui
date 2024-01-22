import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneServiceComponent } from './done-service.component';

describe('DoneServiceComponent', () => {
  let component: DoneServiceComponent;
  let fixture: ComponentFixture<DoneServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoneServiceComponent]
    });
    fixture = TestBed.createComponent(DoneServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
