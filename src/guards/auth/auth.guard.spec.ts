import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { LoginService } from '../../services/login/login.service';
import { BehaviorSubject, isObservable } from 'rxjs';

describe('AuthGuard', () => {
  let mockLoginService: { authStatus$: BehaviorSubject<boolean> };
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockLoginService = {
      authStatus$: new BehaviorSubject<boolean>(false)
    };

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: LoginService, useValue: mockLoginService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should be created', () => { expect(authGuard).toBeTruthy() });

  it('should allow access when logged in', (done) => {
    mockLoginService.authStatus$.next(true);

    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    if (isObservable(result)) {
      result.subscribe(allowed => {
        expect(allowed).toBeTrue();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      });
    } else {
      expect(result).toBeTrue();
      done();
    }
  });

  it('should deny access and redirect to login when not logged in', (done) => {
    mockLoginService.authStatus$.next(false);

    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    if (isObservable(result)) {
      result.subscribe(allowed => {
        expect(allowed).toBeFalse();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
        done();
      });
    } else {
      expect(result).toBeTrue();
      done();
    }
  });

  it('should complete the observable after first emission', (done) => {
    let emissions = 0;

    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    if (isObservable(result)) {
      result.subscribe({
        next: () => emissions++,
        complete: () => {
          expect(emissions).toBe(1);
          done();
        }
      });
    } else {
      expect(result).toBeTrue();
      done();
    }

    mockLoginService.authStatus$.next(true);
  });
});
