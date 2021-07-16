import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private _authenticated = false;

  constructor() {
    if (this.readToken()) this._authenticated = true; else this._authenticated = false;
  }

  get authenticated(): boolean { return this._authenticated; }

  writeUser(token: string, username: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    this._authenticated = true;
  }

  readToken(): string | null { return localStorage.getItem('token'); }
  readUsername(): string | null { return localStorage.getItem('username'); }

  clearUser(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this._authenticated = false;
  }
}
