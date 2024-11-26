import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysqlSourceComponent } from './mysql-source.component';

describe('MysqlSourceComponent', () => {
  let component: MysqlSourceComponent;
  let fixture: ComponentFixture<MysqlSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MysqlSourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MysqlSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
