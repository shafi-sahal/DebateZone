import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SessionService } from './session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private sessionService: SessionService, private router: Router, private http: HttpClient) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const authenticated = this.sessionService.authenticated();
    if (!authenticated) this.router.navigate(['authentication']);
    return authenticated;
  }
}
