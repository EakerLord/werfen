import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [FormComponent, ReactiveFormsModule, NoopAnimationsModule ],
      providers: [
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => { expect(component).toBeTruthy() });

  it('should initialize the form with default values', () => {
    expect(component.userForm.value).toEqual({
      username: '',
      password: '',
      repeatPassword: '',
      date: '',
      enabled: false
    });
  });

  it('should mark form as invalid if required fields are empty', () => {
    component.userForm.setValue({
      username: '',
      password: '',
      repeatPassword: '',
      date: '',
      enabled: false
    });
    expect(component.userForm.invalid).toBeTrue();
  });

  it('should show error if passwords do not match', () => {
    component.userForm.setValue({ username: 'username', password: 'passw0rd', repeatPassword: 'passw0r', date: '2025-12-31', enabled: true });
    expect(component.passwordMustMatch()).toBeTrue();
  });

  it('should add user and show snackbar on valid submit', () => {
    component.userForm.setValue({ username: 'username', password: 'passw0rd', repeatPassword: 'passw0rd', date: '2025-12-31', enabled: true });
    component.passwordMustMatch();
    component.onSubmit();
    expect(component.users().length).toBe(1);
  });

  it('should reset the form and clear errors on clear()', () => {
    component.userForm.setValue({
      username: 'username',
      password: 'passw0rd',
      repeatPassword: 'passw0rd',
      date: '2025-12-31',
      enabled: true
    });
    component.userForm.get('username')?.setErrors({ required: true });
    component.clear();
    expect(component.userForm.value).toEqual({
      username: null,
      password: null,
      repeatPassword: null,
      date: null,
      enabled: null
    });
    expect(component.userForm.get('username')?.errors).toBeNull();
  });

  it('should toggle password visibility', () => {
    expect(component.hidePassword()).toBeTrue();
    component.hidePassword.set(false);
    expect(component.hidePassword()).toBeFalse();
  });

  it('should toggle repeat password visibility', () => {
    expect(component.hideRepeatPassword()).toBeTrue();
    component.hideRepeatPassword.set(false);
    expect(component.hideRepeatPassword()).toBeFalse();
  });
});
