import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/session.service';

@Component({
  selector: 'app-nav-elements',
  templateUrl: './nav-elements.component.html',
  styleUrls: ['./nav-elements.component.scss']
})
export class NavElementsComponent {
  @Output() private closeButtonClicked = new EventEmitter();
  @Input() isMobile = true;
  clickedNavbutton = 'feed';

  constructor(public sessionService: SessionService, private router: Router) { }

  onCloseButtonClick(): void { this.closeButtonClicked.emit(); }

  onLogoutClick(): void {
    this.sessionService.destroySession();
    this.router.navigate(['authentication']);
  }

  getNavButtonClass(buttonName: string): string { return this.clickedNavbutton === buttonName ? 'nav-active' : 'nav'; }
}
