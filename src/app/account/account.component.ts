import { Component } from '@angular/core';
import { Spinner } from '../shared/components/spinner/spinner.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  constructor(private spinner: Spinner) { spinner.hide(); }
}
