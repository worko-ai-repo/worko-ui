import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgResponseComponent } from './pg-response.component';

describe('PgResponseComponent', () => {
  let component: PgResponseComponent;
  let fixture: ComponentFixture<PgResponseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PgResponseComponent]
    });
    fixture = TestBed.createComponent(PgResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
