import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSourceDialogComponent } from './add-source-dialog.component';

describe('AddSourceDialogComponent', () => {
  let component: AddSourceDialogComponent;
  let fixture: ComponentFixture<AddSourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSourceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
