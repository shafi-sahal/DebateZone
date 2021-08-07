// This service is used to load the initial data for modules from the server.
// So, that the request for data can be sent paralelly with the request for the module and so reduce http delays

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './shared/models/user.model';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable({ providedIn: 'root' })
export class InitialDataLoader {
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  load(buttonIndex: number): void {
    if (buttonIndex === 1) this.http.get<User>(BACKEND_URL).subscribe(user => this.user.next(user));
  }
}
