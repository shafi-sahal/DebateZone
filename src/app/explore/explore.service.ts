import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/user.model';

const BACKEND_URL_USER = `${environment.apiUrl}/user`;
const BACKEND_URL_CONNECTION = `${environment.apiUrl}/connection`;

@Injectable()
export class ExploreService {
  private users: User[] = [];

  constructor(private http: HttpClient) {}

  fetchUsers(searchTerm: string): Observable<User[]> {
    return this.http.get<User[]>(`${BACKEND_URL_USER}/search?query=${searchTerm}`);
  }

  sendConnectionRequest(receiverId: number): Observable<boolean> {
    console.log(receiverId);
    return this.http.post<boolean>(BACKEND_URL_CONNECTION, { receiverId });
  }
}
