import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NghelpComponent } from './nghelp.component';

describe('NghelpComponent', () => {
  let component: NghelpComponent;
  let fixture: ComponentFixture<NghelpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NghelpComponent]
    });
    fixture = TestBed.createComponent(NghelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
