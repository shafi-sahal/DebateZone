import { ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Spinner } from '../shared/components/spinner/spinner.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticationComponent implements OnInit, OnDestroy {
  isSignUp = new Subject<boolean>();
  classBodyHeight = 'normal-height';
  private subscriptions = new Subscription();

  constructor(private spinner: Spinner) { this.spinner.hide(); }

  ngOnInit(): void {
    this.subscriptions.add(this.isSignUp.subscribe(isSignUp =>
      this.classBodyHeight = isSignUp ? 'long-height' : 'normal-height')
    );
  }

  setIsSignup(isSignUp: boolean): void { this.isSignUp.next(isSignUp); }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }
}
