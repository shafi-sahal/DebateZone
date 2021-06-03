import { ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticationComponent implements OnInit {
  isSignUp = new Subject<boolean>();
  classBodyHeight = 'normal-height';

  ngOnInit(): void {
    this.isSignUp.subscribe(isSignUp => {
      this.classBodyHeight = isSignUp ? 'long-height' : 'normal-height';
    });
    console.log(document.getElementById('card')?.offsetHeight);
  }

  setIsSignup(isSignUp: boolean): void { this.isSignUp.next(isSignUp); }
}
