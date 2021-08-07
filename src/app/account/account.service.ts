import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/user.model';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable()
export class AccountService {
  user: User = { name: '', username: '', email: '', mobile: '' };
  keepUserLoggedIn = true;

  constructor(private http: HttpClient) {}

  updateUser(data: Record<string, string>): Observable<null> {
    return this.http.put<null>(BACKEND_URL, data);
  }
}
