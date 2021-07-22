import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/session.service';
import { Spinner } from 'src/app/shared/components/spinner/spinner.service';

@Component({
  selector: 'app-nav-elements',
  templateUrl: './nav-elements.component.html',
  styleUrls: ['./nav-elements.component.scss']
})
export class NavElementsComponent {
  @Output() private closeButtonClicked = new EventEmitter();
  @Input() isMobile = true;
  navButtons: { label: string, icon: string, route: string }[] = [
    { label: 'Debates', icon: 'forum', route: '' }, { label: 'Account', icon: 'person' , route: 'account'}
  ]
  clickedNavbuttonIndex = 0;

  constructor(public sessionService: SessionService, private router: Router, private spinner: Spinner) { }

  onCloseButtonClick(): void { this.closeButtonClicked.emit(); }

  onLogoutClick(): void {
    this.spinner.show('Logging out, See you soon...');
    this.sessionService.destroySession();
    this.router.navigate(['authentication']);
  }
}
