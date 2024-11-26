import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiSourceComponent } from './api-source.component';

describe('ApiSourceComponent', () => {
  let component: ApiSourceComponent;
  let fixture: ComponentFixture<ApiSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiSourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
