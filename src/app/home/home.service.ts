import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../shared/models/user.model';

const BACKEND_URL = environment.apiUrl + '/user';

enum Button {
  ACCOUNT = 1
}

@Injectable()
export class HomeService implements OnDestroy{
  user = new BehaviorSubject<User | null>(null);
  changes = new Subject<undefined>();
  isLoading = false;
  hasUser = false;
  private subscriptions = new Subscription();

  constructor(private http: HttpClient) {
    this.subscriptions.add(this.user.subscribe(user => this.hasUser = !!user));
  }

  load(buttonIndex: number): void {
    this.isLoading = true;

    if (buttonIndex === Button.ACCOUNT) {
      if (this.hasUser) this.isLoading = false; else this.fetchUser();
    }
  }

  private fetchUser(): void {
    this.http.get<User>(BACKEND_URL).subscribe(user => {
      this.user.next(user);
      this.isLoading = false;
      this.changes.next();
    });
  }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }
}
