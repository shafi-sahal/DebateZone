import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SessionService } from './session.service';
import { User } from './shared/models/user.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private sessionService: SessionService, private router: Router, private http: HttpClient) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const authenticated = this.sessionService.authenticated();console.log(authenticated);
    if (!authenticated){
      this.router.navigate(['authentication']);
      return authenticated;
    }

    this.sessionService.userFetched.pipe(
      first(),
      filter(user => user === null),
      switchMap(() => this.http.get<{ user: User }>(environment.apiUrl + '/user'))
    ).subscribe(response => this.sessionService.userFetched.next(response.user));

    return authenticated;
  }
}
