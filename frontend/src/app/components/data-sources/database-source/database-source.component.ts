import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { databaseConnectionValidator } from '../../../utils/validators';

@Component({
  selector: 'app-database-source',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="dbForm" (ngSubmit)="onSubmit()">
      <label for="host">Host</label>
      <input id="host" formControlName="host" />
      <label for="port">Port</label>
      <input id="port" formControlName="port" />
      <label for="user">User</label>
      <input id="user" formControlName="user" />
      <label for="password">Password</label>
      <input id="password" type="password" formControlName="password" />
      <label for="dbname">Database Name</label>
      <input id="dbname" formControlName="dbname" />
      <button type="submit" [disabled]="dbForm.invalid">Submit</button>
    </form>
  `,
})
export class DatabaseSourceComponent {
  dbForm; 

  constructor(private readonly fb: FormBuilder) {
    this.dbForm = this.fb.group(
      {
        host: ['', Validators.required],
        port: ['', Validators.required],
        user: ['', Validators.required],
        password: ['', Validators.required],
        dbname: ['', Validators.required],
      },
      { validators: databaseConnectionValidator }
    );
  }

  onSubmit() {
    if (this.dbForm.valid) {
      console.log(this.dbForm.value);
    }
  }
}
