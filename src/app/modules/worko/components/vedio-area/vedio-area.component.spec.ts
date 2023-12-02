import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VedioAreaComponent } from './vedio-area.component';

describe('VedioAreaComponent', () => {
  let component: VedioAreaComponent;
  let fixture: ComponentFixture<VedioAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VedioAreaComponent]
    });
    fixture = TestBed.createComponent(VedioAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
