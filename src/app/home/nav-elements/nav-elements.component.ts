import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/session.service';

@Component({
  selector: 'app-nav-elements',
  templateUrl: './nav-elements.component.html',
  styleUrls: ['./nav-elements.component.scss']
})
export class NavElementsComponent {
  @Output() private closeButtonClicked = new EventEmitter();

  constructor(public sessionService: SessionService, private router: Router) { }

  onCloseButtonClick(): void { this.closeButtonClicked.emit(); }

  onLogoutClick(): void {
    this.sessionService.destroySession();
    this.router.navigate(['authentication']);
  }
}
