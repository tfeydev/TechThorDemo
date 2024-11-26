import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvSourceComponent } from './csv-source.component';

describe('CsvSourceComponent', () => {
  let component: CsvSourceComponent;
  let fixture: ComponentFixture<CsvSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsvSourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
