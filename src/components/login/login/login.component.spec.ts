import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../../services/login/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: jasmine.SpyObj<LoginService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let router: jasmine.SpyObj<Router>;
  let authStatus$: Subject<boolean>;

  beforeEach(async () => {
    authStatus$ = new Subject<boolean>();
    loginService = jasmine.createSpyObj('LoginService', ['login'], { authStatus$: authStatus$ });
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSnackBarModule, NoopAnimationsModule],
      providers: [
        { provide: LoginService, useValue: loginService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => { expect(component).toBeTruthy() });

  it('should have invalid form initially', () => {
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should show error messages when fields are touched and invalid', () => {
    const usernameControl = component.loginForm.get('username');
    usernameControl?.markAsTouched();
    fixture.detectChanges();

    const errorMsg = fixture.debugElement.query(By.css('mat-error'));
    expect(errorMsg).toBeTruthy();
    expect(errorMsg.nativeElement.textContent).toContain('User required');
  });

  it('should call loginService.login with form values on valid submit', () => {
    component.loginForm.setValue({ username: 'admin', password: '123456' });
    component.onLogin();
    expect(component.loginAttempted).toBeTrue();
    expect(loginService.login).toHaveBeenCalledWith('admin', '123456');
  });

  it('should show success snackbar and navigate on correct credentials', fakeAsync(() => {
    component.loginForm.setValue({ username: 'admin', password: '123456' });
    component.onLogin();
    authStatus$.next(true);
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['form']);
    expect(component.loginAttempted).toBeFalse();
  }));

  it('should show error snackbar on incorrect credentials', fakeAsync(() => {
    component.loginForm.setValue({ username: 'admin', password: 'wrong' });
    component.onLogin();
    authStatus$.next(false);
    tick();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.loginAttempted).toBeFalse();
  }));

  it('should toggle password visibility', () => {
    expect(component.hidePassword).toBeTrue();
    component.hidePassword = false;
    expect(component.hidePassword).toBeFalse();
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component['sub'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['sub'].unsubscribe).toHaveBeenCalled();
  });
});
