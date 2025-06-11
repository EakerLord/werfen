import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        FormComponent, // Standalone
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDatepickerToggle,
        MatSnackBarModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatSnackBar, useValue: snackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component.userForm.invalid).toBeTrue();
  });

  it('should show required error for username when touched and empty', () => {
    const usernameControl = component.userForm.get('username');
    usernameControl?.markAsTouched();
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('mat-error'));
    expect(error.nativeElement.textContent).toContain('Username is required');
  });

  it('should set paswordsMatch signal to true when passwords match', () => {
    component.userForm.get('password')?.setValue('abc123');
    component.userForm.get('repeatPassword')?.setValue('abc123');
    fixture.detectChanges();
    expect(component.paswordsMatch()).toBeTrue();
  });

  it('should set paswordsMatch signal to false when passwords do not match', () => {
    component.userForm.get('password')?.setValue('abc123');
    component.userForm.get('repeatPassword')?.setValue('other');
    fixture.detectChanges();
    expect(component.paswordsMatch()).toBeFalse();
  });

  it('should show snackbar if user already exists', fakeAsync(() => {
    component.users.set([{ username: 'username', password: 'passw0rd', repeatPassword: 'passw0rd', date:'2025-12-31',  enabled: true }]);
    component.userForm.setValue({
      username: 'username',
      password: 'passw0rd',
      repeatPassword: 'passw0rd',
      date: '2025-12-31',
      enabled: true
    });
    component.onSubmit();
    tick();
  }));

  it('should clear the form after submit', () => {
    component.userForm.setValue({
      username: 'username',
      password: 'passw0rd',
      repeatPassword: 'passw0rd',
      date: '2025-12-31',
      enabled: true
    });
    component.clear();
    expect(component.userForm.value.username).toBeNull();
    expect(component.userForm.value.password).toBeNull();
    expect(component.userForm.value.repeatPassword).toBeNull();
    expect(component.userForm.value.date).toBeNull();
    expect(component.userForm.value.enabled).toBeNull();
  });
});
