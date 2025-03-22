import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminScreenerComponent } from './admin-screener.component';

describe('AdminScreenerComponent', () => {
  let component: AdminScreenerComponent;
  let fixture: ComponentFixture<AdminScreenerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminScreenerComponent]
    });
    fixture = TestBed.createComponent(AdminScreenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
