import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/user.model';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import { catchError, map } from 'rxjs/operators';
import { SessionService } from '../session.service';

const USER_URL = environment.apiUrl + '/user';
const IS_DUPLICATE_URL = USER_URL + '/is-duplicate';

@Injectable()
export class AuthenticationService {
  countryCode = '';
  private _user!: User;

  constructor(private http: HttpClient,private sessionService: SessionService) {}

  set user(user: User) {
    this._user = user;
    if (this._user.mobile) this._user.mobile = this.parseMobile(this._user.mobile, this.countryCode);
  }

  isDuplicateUsername(username: string): Observable<boolean> {
    return this.http.get<boolean>(IS_DUPLICATE_URL + '?username=' + username);
  }

  isDuplicateEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(IS_DUPLICATE_URL + '?email=' + email);
  }

  isDuplicateMobile(mobile: string): Observable<boolean> {
    const mobileForUrl = mobile.replace('+', '%2B');
    return this.http.get<boolean>(IS_DUPLICATE_URL + '?mobile=' + mobileForUrl);
  }

  addUser(): Observable<boolean> {
    return this.http.post<{ token: string, user: User }>(USER_URL + '/signup', this._user).pipe(
      map(response => {
        this.sessionService.createSession(response.token, response.user);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  login(loginKey: string, password: string): Observable<boolean> {
    const loginData = { loginKey: loginKey, password: password };
    return this.http.post<{ token: string, user: User }>(USER_URL, loginData).pipe(
      map(response => {
        this.sessionService.createSession(response.token, response.user);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  getCountryCodeFromMobile(mobile: string): string | undefined {
    try { return parsePhoneNumber(mobile).country; } catch { return undefined; }
  }

  private parseMobile(mobile: string, countryCode: string): string {
    return parsePhoneNumber(mobile, countryCode as CountryCode).number.toString();
  }
}
