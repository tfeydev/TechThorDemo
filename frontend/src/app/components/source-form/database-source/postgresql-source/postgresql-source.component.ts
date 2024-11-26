import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-postgresql-source',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div [formGroup]="postgresForm">
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
    </div>
  `,
})
export class PostgresqlSourceComponent {
  postgresForm;

  constructor(private fb: FormBuilder) {
    this.postgresForm = this.fb.group({
      host: ['', Validators.required],
      port: ['', Validators.required],
      user: ['', Validators.required],
      password: ['', Validators.required],
      dbname: ['', Validators.required],
    });
  }
}
