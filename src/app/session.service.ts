/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Injectable } from '@angular/core';
import { User } from './shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  isAuthenticated(): boolean { return !!this.token; }

  createSession(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  set KeepUserLoggedIn(keepUserLoggedIn: boolean) { localStorage.setItem('keepUserLoggedIn', keepUserLoggedIn.toString()); }
  get KeepUserLoggedIn() { return localStorage.getItem('keepUserLoggedIn') === 'true'; }

  get token(): string | null { return localStorage.getItem('token'); }

  get user(): User | null {
    const stringUser = localStorage.getItem('user');
    if (stringUser) return JSON.parse(stringUser); else return null;
  }



  destroySession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
