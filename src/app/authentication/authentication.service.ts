import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import { Spinner } from '../shared/components/spinner/spinner.service';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable()
export class AuthenticationService {
  private _user!: User;
  private _countryCode = '';

  constructor(
    private http: HttpClient,
    private spinner: Spinner
  ) {}

  set user(user: User) {
    this._user = user;
    this._user.mobile = this.parseMobile(this._user.mobile, this._countryCode);
  }

  set countryCode(countryCode: string) { this._countryCode = countryCode; }

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
    const userAdded = new Subject<boolean>();
    this.http.post<{ isSuccess: boolean }>(BACKEND_URL + '/signup', this._user).subscribe(response => {
        console.log(response);
        this.spinner.hide();
        userAdded.next(true);
    });
    return userAdded.asObservable();
  }

  login(emailOrUsername: string, password: string): void {
    const loginData = { emailOrUsername: emailOrUsername, password: password };
    this.http.post<{ isSuccess: boolean }>(BACKEND_URL, loginData).subscribe(response => {
      console.log(response.isSuccess);
    });
  }

  private parseMobile(mobile: string, countryCode: string): string {
    return parsePhoneNumber(mobile, countryCode as CountryCode).number.toString();
  }
}
