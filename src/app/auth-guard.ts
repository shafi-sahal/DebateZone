import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService } from './session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private sessionService: SessionService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.sessionService.isAuthenticated();
    if (!isAuthenticated) this.router.navigate(['/authentication']);
    return isAuthenticated;
  }
}
