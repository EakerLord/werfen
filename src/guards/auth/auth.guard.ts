// auth.guard.ts
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) => {
  const authService = inject(LoginService);
  const router = inject(Router);

  return authService.authStatus$.pipe(
    take(1),
    map(isLoggedIn => {
      if (!isLoggedIn) {
        alert('You are not logged in!');
        router.navigate(['login']);
        return false;
      }
      return true;
    })
  );
};
