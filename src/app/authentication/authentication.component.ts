import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Spinner } from '../shared/components/spinner/spinner.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticationComponent {
  isSignUp = new Subject<boolean>();
  constructor(private spinner: Spinner) { this.spinner.hide(); }
}
