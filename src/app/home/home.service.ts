import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Subject } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/user.model';

const BACKEND_URL = environment.apiUrl + '/user';

enum Button {
  DEBATES = 0,
  ACCOUNT = 1
}

@Injectable()
export class HomeService {
  user = new BehaviorSubject<User | null>(null);
  changes = new Subject<undefined>();
  isDataLoading = false;
  isRouting = false;
  constructor(private http: HttpClient) {}

  load(buttonIndex: number): void {
    this.isDataLoading = true;
    if (buttonIndex === Button.DEBATES) this.isDataLoading = false;
    else if (buttonIndex === Button.ACCOUNT) this.fetchUser();
  }

  private fetchUser(): void {
    this.user.pipe(
      first(user => {
        if(!user) return true;
        this.isDataLoading = false;
        return false;
      }),
      switchMap(() => this.http.get<User>(BACKEND_URL))
    )
    .subscribe(user => {
      this.user.next(user);
      this.isDataLoading = false;
      this.changes.next();
    });
  }
}
