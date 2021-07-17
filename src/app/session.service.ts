
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from './shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  userFetched = new BehaviorSubject<User | null>(null);

  authenticated(): boolean { return !!this.readToken(); }

  createSession(token: string, user: User): void {
    localStorage.setItem('token', token);
    this.userFetched.next(user);
  }

  readToken(): string | null { return localStorage.getItem('token'); }

  destroySession(): void {
    localStorage.removeItem('token');
  }
}
