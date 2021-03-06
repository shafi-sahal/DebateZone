import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { SessionService } from './session.service';

@Injectable()
export class AuthenticationModuleGuard implements CanLoad {
  constructor(private sessionService: SessionService, private router: Router) {}

  canLoad(): boolean {
    const isAuthenticated = this.sessionService.isAuthenticated;
    if (isAuthenticated) this.router.navigate(['/']);
    return !isAuthenticated;
  }
}
