import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable()
export class AuthenticationService {
  private _user!: User;

  constructor(
    private http: HttpClient
  ) {}

  set user(user: User) { this._user = user; }

  addUser(): Observable<boolean> {
    const userAdded = new Subject<boolean>();
    this.http.post<{message: string}>(BACKEND_URL, this._user).subscribe(response => {
      console.log(response);
      userAdded.next(true);
    });
    return userAdded.asObservable();
  }
}
