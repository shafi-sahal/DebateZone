import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'selenium-webdriver';
import { SessionService } from 'src/app/session.service';

@Component({
  selector: 'app-nav-elements',
  templateUrl: './nav-elements.component.html',
  styleUrls: ['./nav-elements.component.scss']
})
export class NavElementsComponent {
  @Output() private closeButtonClicked = new EventEmitter();
  @Input() isMobile = true;
  navButtons: { label: string, icon: string }[] = [ { label: 'Debates', icon: 'forum' }, { label: 'Account', icon: 'person' } ]
  clickedNavbuttonIndex = 0;

  constructor(public sessionService: SessionService, private router: Router) { }

  onCloseButtonClick(): void { this.closeButtonClicked.emit(); }

  onLogoutClick(): void {
    this.sessionService.destroySession();
    this.router.navigate(['authentication']);
  }

  onAccountClick(): void {
    this.router.navigate(['account']);
  }
}
