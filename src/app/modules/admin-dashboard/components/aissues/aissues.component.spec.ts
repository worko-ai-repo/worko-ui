import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AissuesComponent } from './aissues.component';

describe('AissuesComponent', () => {
  let component: AissuesComponent;
  let fixture: ComponentFixture<AissuesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AissuesComponent]
    });
    fixture = TestBed.createComponent(AissuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
