import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../services/login/login.service';
import { Subscription } from 'rxjs';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatLabel, MatError, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit, OnDestroy {
  loginService = inject(LoginService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  fb = new FormBuilder();
  loginResult?: boolean;
  private sub!: Subscription;
  // Helper variables
  hidePassword = true;
  loginAttempted = false;

  loginForm = this.fb.group({
    username: new FormControl('', {validators: [Validators.required, Validators.minLength(4)]}),
    password: new FormControl('', {validators: [Validators.required, Validators.minLength(2)]}),
  });

  ngOnInit() {
    this.sub = this.loginService.authStatus$.subscribe(result => {
      this.loginResult = result;
      if (this.loginAttempted) {
        if (result === true) {
          this.snackBar.open('✅ Correct credentials', 'Close', {
            duration: 6000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['form']);
        } else if (result === false) {
          this.snackBar.open('❌ User or password incorrect, try again', 'Close', {
            duration: 6000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
        this.loginAttempted = false;
      }
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loginAttempted = true;
      const { username, password } = this.loginForm.value;
      this.loginService.login(username!, password!);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
