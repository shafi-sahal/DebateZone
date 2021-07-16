import { Injectable } from '@angular/core';
import { User } from './shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private _authenticated;
  user!: User | null;

  constructor() {
    if (this.readToken()) this._authenticated = true; else this._authenticated = false;
  }

  get authenticated(): boolean { return this._authenticated; }

  createSession(token: string, user: User): void {
    localStorage.setItem('token', token);
    this.user = user;
    console.log(user);
    this._authenticated = true;
  }

  readToken(): string | null { return localStorage.getItem('token'); }

  destroySession(): void {
    localStorage.removeItem('token');
    this.user = null;
    this._authenticated = false;
  }
}
