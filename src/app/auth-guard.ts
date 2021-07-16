import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from './session.service';
import { User } from './shared/models/user.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private sessionService: SessionService, private router: Router, private http: HttpClient) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const authenticated = this.sessionService.authenticated;
    if (!authenticated) this.router.navigate(['authentication']);
    if (!this.sessionService.user) {
      this.http.get<{ user: User }>(environment.apiUrl + '/user').subscribe(response => this.sessionService.user = response.user);
    }
    return authenticated;
  }
}
