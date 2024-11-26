import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSourceDialogComponent } from './edit-source-dialog.component';

describe('EditSourceDialogComponent', () => {
  let component: EditSourceDialogComponent;
  let fixture: ComponentFixture<EditSourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSourceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
