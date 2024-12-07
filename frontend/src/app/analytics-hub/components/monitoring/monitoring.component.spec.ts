import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceStatusComponent } from './monitoring.component';

describe('SourceStatusComponent', () => {
  let component: SourceStatusComponent;
  let fixture: ComponentFixture<SourceStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
