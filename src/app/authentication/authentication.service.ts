import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable()
export class AuthenticationService {
  private _user!: User;
  private _countryCode = '';

  constructor(
    private http: HttpClient
  ) {}

  set user(user: User) { this._user = user; }
  set countryCode(countryCode: string) { this._countryCode = countryCode; }

  addUser(): void{
    this.parseMobile();
    console.log(this._user);
   /* const userAdded = new Subject<boolean>();
    this.http.post<{message: string}>(BACKEND_URL, this._user).subscribe(response => {
      console.log(response);
      userAdded.next(true);
    });
    return userAdded.asObservable();*/
  }

  private parseMobile(): void{
    const mobileParsed = parsePhoneNumber(this._user.mobile, this._countryCode as CountryCode);
    this._user.mobile = mobileParsed.number.toString();
  }
}
