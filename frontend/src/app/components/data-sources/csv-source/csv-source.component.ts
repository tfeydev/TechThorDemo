import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SourceService } from '../../../services/source.service';

@Component({
  selector: 'app-csv-source',
  templateUrl: './csv-source.component.html',
  styleUrls: ['./csv-source.component.scss'],
})
export class CsvSourceComponent {
  csvForm: FormGroup;

  constructor(private fb: FormBuilder, private sourceService: SourceService) {
    this.csvForm = this.fb.group({
      file_path: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.csvForm.valid) {
      this.sourceService.addSource({ ...this.csvForm.value, type: 'csv' }).subscribe({
        next: (response) => {
          console.log('Source added:', response);
        },
        error: (err) => {
          console.error('Error adding source:', err);
        },
      });
    }
  }
}
