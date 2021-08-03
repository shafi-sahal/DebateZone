import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/user.model';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable()
export class AccountService {
  user: User = { name: '', username: '', email: '', mobile: '' };

  constructor(private http: HttpClient) {}

  fetchUser(): Observable<User> {
    return this.http.get<{ user: User }>(BACKEND_URL).pipe(
      map(response => {
        this.user = response.user;
        return response.user;
      })
    );
  }
}
