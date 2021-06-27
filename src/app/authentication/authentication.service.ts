import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import { Encrypter } from '../shared/services/encrypter.service';
import { Spinner } from '../shared/components/spinner/spinner.service';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable()
export class AuthenticationService {
  private _user!: User;
  private _countryCode = '';

  constructor(
    private http: HttpClient,
    private encrypter: Encrypter,
    private spinner: Spinner
  ) {}

  set user(user: User) {
    this._user = user;
    this._user.mobile = this.parseMobile(this._user.mobile, this._countryCode);
    console.log(this._user.password);
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
    return this.http.get<{ isDuplicateMobile: boolean }>(BACKEND_URL + '?mobile=' + this.parseMobile(mobile, countryCode).replace('+', '%2B')).pipe(
      map(response => response.isDuplicateMobile)
    );
  }

  addUser(): Observable<boolean> {
    this.spinner.show('Setting up your account...');
    const userAdded = new Subject<boolean>();
    this.http.post<{message: string}>(BACKEND_URL, {...this._user, password: this.encrypter.encrypt(this._user.password)})
      .subscribe(response => {
        console.log(response);
        this.spinner.hide();
        userAdded.next(true);
    });
    return userAdded.asObservable();
  }

  private parseMobile(mobile: string, countryCode: string): string {
    return parsePhoneNumber(mobile, countryCode as CountryCode).number.toString();
  }
}
