import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledServiceComponent } from './cancelled-service.component';

describe('CancelledServiceComponent', () => {
  let component: CancelledServiceComponent;
  let fixture: ComponentFixture<CancelledServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancelledServiceComponent]
    });
    fixture = TestBed.createComponent(CancelledServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
