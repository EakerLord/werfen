import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';
import { take } from 'rxjs';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => { expect(service).toBeTruthy() });

  it('should emit false as initial auth status', (done) => {
    service.authStatus$.subscribe(status => {
      expect(status).toBeFalse();
      done();
    });
  });

  it('should return false from isLoggedIn() initially', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should emit true and isLoggedIn() should return true after correct login', (done) => {
    service.authStatus$.subscribe(status => {
      if (status) {
        expect(service.isLoggedIn()).toBeTrue();
        done();
      }
    });
    service.login('admin', '123456');
  });

  it('should emit false and isLoggedIn() should return false after incorrect login', (done) => {
    service.login('admin', 'wrongpass');

    service.authStatus$.pipe(
      take(1)
    ).subscribe(status => {
      expect(status).toBeFalse();
      expect(service.isLoggedIn()).toBeFalse();
      done();
    });
  });

  it('should emit false and isLoggedIn() should return false after logout', (done) => {
    service.login('admin', '123456');
    service.logout();
    service.authStatus$.subscribe(status => {
      expect(status).toBeFalse();
      expect(service.isLoggedIn()).toBeFalse();
      done();
    });
  });
});
