import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { User } from './form.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepickerToggle,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatError,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  fb = new FormBuilder();
  users = signal<User[]>([]);
  snackBar = inject(MatSnackBar);
  hidePassword = signal(true);
  hideRepeatPassword = signal(true);

  userForm = this.fb.group({
    username: new FormControl('', {validators: [Validators.required, Validators.minLength(6)]}),
    password: new FormControl('', {validators: [Validators.required, Validators.minLength(2)]}),
    repeatPassword: new FormControl('', {validators: [Validators.required, Validators.minLength(2)]}),
    date: new FormControl('', {validators: [Validators.required]}),
    enabled: new FormControl(false)
  });

  ngOnInit(): void {
    const usersString = localStorage.getItem('users');
    if (usersString) {
      this.users.set(JSON.parse(usersString));
    }
  }

  passwordMustMatch() {
    const isError = this.userForm.get('password')?.value !== this.userForm.get('repeatPassword')?.value;
    if (isError) {
      this.userForm.get('repeatPassword')?.setErrors({mustMatch: true});
    }
    return isError;
  }

  onSubmit() {
    if (this.userForm.valid) {
      const newUser = this.userForm.value as User;
      const exists = this.users().find(user => user.username === newUser.username);

      if (exists) {
        this.snackBar.open('⚠️ User already exists', 'Close', {
          duration: 6000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      } else {
        this.users.set([...this.users(), this.userForm.value as User]);
        localStorage.setItem('users', JSON.stringify(this.users()));

        this.snackBar.open('✅ User created successfully', 'Close', {
          duration: 6000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }

      this.clear();
    }
  }

  clear() {
    this.userForm.reset();
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.setErrors(null);
    });
  }
}
