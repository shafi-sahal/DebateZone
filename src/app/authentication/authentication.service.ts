import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import { Spinner } from '../shared/components/spinner/spinner.service';
import { catchError, map } from 'rxjs/operators';
import { SessionService } from '../session.service';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable()
export class AuthenticationService {
  countryCode = '';
  private _user!: User;
  private _token = '';

  constructor(
    private http: HttpClient,
    private spinner: Spinner,
    private sessionService: SessionService
  ) {}

  set user(user: User) {
    this._user = user;
    this._user.mobile = this.parseMobile(this._user.mobile, this.countryCode);
  }

  get token(): string { return this._token; }

  isDuplicateUsername(username: string): Observable<boolean> {
    return this.http.get<{ isDuplicateUsername: boolean }>(BACKEND_URL + '?username=' + username).pipe(
      map(response => response.isDuplicateUsername)
    );
  }

  isDuplicateEmail(email: string): Observable<boolean> {
    return this.http.get<{ isDuplicateEmail: boolean }>(BACKEND_URL + '?email=' + email).pipe(
      map(response => response.isDuplicateEmail)
    );
  }

  isDuplicateMobile(mobile: string, countryCode: string): Observable<boolean> {
    const mobileParsed = this.parseMobile(mobile, countryCode).replace('+', '%2B');
    return this.http.get<{ isDuplicateMobile: boolean }>(BACKEND_URL + '?mobile=' + mobileParsed).pipe(
      map(response => response.isDuplicateMobile)
    );
  }

  addUser(): Observable<boolean> {
    this.spinner.show('Setting up your account...');
    return this.http.post(BACKEND_URL + '/signup', this._user).pipe(map(() => true), catchError(() => of(false)));
  }

  login(loginKey: string, password: string): Observable<boolean> {
    this.spinner.show('Taking you where you want to go...');
    const loginData = { loginKey: loginKey, password: password };
    return this.http.post<{ token: string }>(BACKEND_URL, loginData).pipe(
      map(response => {
        this._token = response.token;
        this.sessionService.writeToken(this._token);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  getCountryFromMobile(mobile: string): string | undefined {
    try { return parsePhoneNumber(mobile).country; } catch { return undefined; }
  }

  private parseMobile(mobile: string, countryCode: string): string {
    return parsePhoneNumber(mobile, countryCode as CountryCode).number.toString();
  }
}
