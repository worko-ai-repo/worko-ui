import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicServicePackagesComponent } from './public-service-packages.component';

describe('PublicServicePackagesComponent', () => {
  let component: PublicServicePackagesComponent;
  let fixture: ComponentFixture<PublicServicePackagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublicServicePackagesComponent]
    });
    fixture = TestBed.createComponent(PublicServicePackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
