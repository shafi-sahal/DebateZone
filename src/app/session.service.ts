import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionService {

  writeUser(token: string, userId: number): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId.toString());
  }

  readToken(): string | null { return localStorage.getItem('token'); }

  readUserId(): number {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : 0;
  }

  clearUser(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }
}
