import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/user.model';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable()
export class HomeService {
  user = new BehaviorSubject<User | null>(null);
  changes = new Subject<void>();
  isLoading = false;

  constructor(private http: HttpClient) {}

  load(buttonIndex: number): void {
    this.isLoading = true;
    this.user.pipe(
      first(user => user === null && buttonIndex === 1),
      switchMap(() => this.http.get<User>(BACKEND_URL))
    )
    .subscribe(user => {
      this.user.next(user);
      this.isLoading = false;
      this.changes.next();
    });
  }
}
