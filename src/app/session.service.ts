
import { Injectable } from '@angular/core';
import { User } from './shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  isAuthenticated(): boolean { return !!this.readToken(); }

  createSession(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  writeKeepUserLoggedIn(keepUserLoggedIn: boolean): void { localStorage.setItem('keepUserLoggedIn', keepUserLoggedIn.toString()); }

  readToken(): string | null { return localStorage.getItem('token'); }

  readUser(): User | null {
    const stringUser = localStorage.getItem('user');
    if (stringUser) return JSON.parse(stringUser); else return null;
  }

  readKeepUserLoggedIn(): boolean | null { return localStorage.getItem('keepUserLoggedIn') === 'true'; }

  destroySession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
