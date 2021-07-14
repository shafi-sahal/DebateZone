import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionService {

  writeToken(token: string): void {
    localStorage.setItem('token', token);
  }

  readToken(): string | null {
    return localStorage.getItem('token');
  }
}
