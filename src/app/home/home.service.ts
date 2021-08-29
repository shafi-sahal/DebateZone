import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/user.model';
import { NavButton } from './nav-buttons-enum';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable()
export class HomeService {
  user = new BehaviorSubject<User | null>(null);
  changes = new Subject<undefined>();
  isDataLoading = false;
  isRouting = false;
  constructor(private http: HttpClient) {}

  load(buttonIndex: number): void {
    this.isDataLoading = true;
    if (buttonIndex === NavButton.DEBATES) this.isDataLoading = false;
    else if (buttonIndex === NavButton.ACCOUNT) this.fetchUser();
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
