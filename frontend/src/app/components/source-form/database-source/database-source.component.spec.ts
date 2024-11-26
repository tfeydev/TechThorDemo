import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseSourceComponent } from './database-source.component';

describe('DatabaseSourceComponent', () => {
  let component: DatabaseSourceComponent;
  let fixture: ComponentFixture<DatabaseSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseSourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
