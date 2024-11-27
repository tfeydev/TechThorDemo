import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewYamlDialogComponent } from './view-yaml-dialog.component';

describe('ViewYamlDialogComponent', () => {
  let component: ViewYamlDialogComponent;
  let fixture: ComponentFixture<ViewYamlDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewYamlDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewYamlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
