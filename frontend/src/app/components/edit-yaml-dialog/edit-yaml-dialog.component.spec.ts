import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditYamlDialogComponent } from './edit-yaml-dialog.component';

describe('EditYamlDialogComponent', () => {
  let component: EditYamlDialogComponent;
  let fixture: ComponentFixture<EditYamlDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditYamlDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditYamlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
