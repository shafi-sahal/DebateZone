import { Component } from '@angular/core';
import { Spinner } from './shared/components/spinner/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DebateZone';
  constructor(private spinner: Spinner) { this.spinner.show('I am coming...'); }
}
