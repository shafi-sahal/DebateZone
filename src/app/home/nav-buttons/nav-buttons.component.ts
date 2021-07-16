import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/session.service';

@Component({
  selector: 'app-nav-buttons',
  templateUrl: './nav-buttons.component.html',
  styleUrls: ['./nav-buttons.component.scss']
})
export class NavButtonsComponent {

  constructor(public sessionService: SessionService, private router: Router) { }

  onClickLogout(): void {
    this.sessionService.destroySession();
    this.router.navigate(['authentication']);
  }
}
