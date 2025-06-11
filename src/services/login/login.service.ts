import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginStatusSubject = new BehaviorSubject<boolean>(false);
  authStatus$ = this.loginStatusSubject.asObservable();

  private readonly hardcodedUser = 'admin';
  private readonly hardcodedPass = '123456';

  login(username: string, password: string) {
    const isValid = username === this.hardcodedUser && password === this.hardcodedPass;
    this.loginStatusSubject.next(isValid);
  }

  isLoggedIn(): boolean { return this.loginStatusSubject.value };

  logout() { this.loginStatusSubject.next(false) };
}
