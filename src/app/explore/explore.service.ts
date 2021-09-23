import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/user.model';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable()
export class ExploreService {
  private users: User[] = [];

  constructor(private http: HttpClient) {}

  fetchUsers(searchTerm: string): Observable<User[]> {
    return this.http.get<User[]>(BACKEND_URL + '/search?query=' + searchTerm);
  }
}
