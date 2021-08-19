import { Injectable } from '@angular/core';
import { User } from './shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private _token: string | null = this.readToken();
  private _isAuthenticated = !!this._token;
  private _user: User | null = this.readUser();
  private _keepUserLoggedIn = this.readKeepUserLoggedIn();

  set user(user: User | null) {
    const userDataToStore = { name: user?.name, username: user?.username };
    localStorage.setItem('user', JSON.stringify(userDataToStore));
    this._user = user;
  }
  get user(): User | null { return this._user; }

  set keepUserLoggedIn(keepUserLoggedIn: boolean) {
    localStorage.setItem('keepUserLoggedIn', keepUserLoggedIn.toString());
    this._keepUserLoggedIn = keepUserLoggedIn;
  }

  get keepUserLoggedIn(): boolean { return this._keepUserLoggedIn; }
  get token(): string | null { return this._token; }
  get isAuthenticated(): boolean { return this._isAuthenticated; }

  createSession(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this._token = token;
    this._isAuthenticated = true;
    this._user = user;
  }

  destroySession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._token = null;
    this._isAuthenticated = false;
    this._user = null;
  }

  onStorageChange(): void {
    this._token = this.readToken();
    this._isAuthenticated = !!this._token;
    this._user = this.readUser();
    this.keepUserLoggedIn = this.readKeepUserLoggedIn();
  }


  private readKeepUserLoggedIn(): boolean { return localStorage.getItem('keepUserLoggedIn') === 'true'; }
  private readToken(): string | null { return localStorage.getItem('token'); }

  private readUser(): User | null {
    const stringUser = localStorage.getItem('user');
    if (stringUser) return JSON.parse(stringUser); else return null;
  }
}
