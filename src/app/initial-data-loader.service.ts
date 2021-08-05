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
    if (buttonIndex === 1) this.http.get<{ user: User }>(BACKEND_URL).subscribe(response => this.user.next(response.user));
  }
}
