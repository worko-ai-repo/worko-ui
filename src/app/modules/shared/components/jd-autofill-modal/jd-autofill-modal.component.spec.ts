import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JdAutofillModalComponent } from './jd-autofill-modal.component';

describe('JdAutofillModalComponent', () => {
  let component: JdAutofillModalComponent;
  let fixture: ComponentFixture<JdAutofillModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JdAutofillModalComponent]
    });
    fixture = TestBed.createComponent(JdAutofillModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
