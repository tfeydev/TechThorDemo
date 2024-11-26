import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostgresqlSourceComponent } from './postgresql-source.component';

describe('PostgresqlSourceComponent', () => {
  let component: PostgresqlSourceComponent;
  let fixture: ComponentFixture<PostgresqlSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostgresqlSourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostgresqlSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
