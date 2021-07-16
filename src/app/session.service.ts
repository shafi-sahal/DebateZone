import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private _authenticated = false;

  constructor() {
    if (this.readToken()) this._authenticated = true; else this._authenticated = false;
  }

  get authenticated(): boolean { return this._authenticated; }

  writeToken(token: string): void {
    localStorage.setItem('token', token);
    this._authenticated = true;
  }

  readToken(): string | null { return localStorage.getItem('token'); }

  clearToken(): void {
    localStorage.removeItem('token');
    this._authenticated = false;
  }
}
