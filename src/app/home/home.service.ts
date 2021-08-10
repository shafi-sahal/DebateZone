import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/user.model';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable()
export class HomeService {
  user = new BehaviorSubject<User | null>(null);
  changes = new Subject<undefined>();

  constructor(private http: HttpClient) {}

  load(buttonIndex: number): void {
    if (buttonIndex === 1) this.http.get<User>(BACKEND_URL).subscribe(user => this.user.next(user));
  }
}
