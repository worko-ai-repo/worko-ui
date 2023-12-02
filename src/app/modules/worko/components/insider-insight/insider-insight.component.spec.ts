import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsiderInsightComponent } from './insider-insight.component';

describe('InsiderInsightComponent', () => {
  let component: InsiderInsightComponent;
  let fixture: ComponentFixture<InsiderInsightComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InsiderInsightComponent]
    });
    fixture = TestBed.createComponent(InsiderInsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
