import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonSourceComponent } from './json-source.component';

describe('JsonSourceComponent', () => {
  let component: JsonSourceComponent;
  let fixture: ComponentFixture<JsonSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonSourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
