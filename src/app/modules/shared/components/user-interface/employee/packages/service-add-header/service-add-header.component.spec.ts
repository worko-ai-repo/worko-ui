import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAddHeaderComponent } from './service-add-header.component';

describe('ServiceAddHeaderComponent', () => {
  let component: ServiceAddHeaderComponent;
  let fixture: ComponentFixture<ServiceAddHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceAddHeaderComponent]
    });
    fixture = TestBed.createComponent(ServiceAddHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
