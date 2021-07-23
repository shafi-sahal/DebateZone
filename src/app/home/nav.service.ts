import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable()
export class NavService implements OnDestroy {
  navButtons: { label: string, icon: string, route: string }[] = [
    { label: 'Debates', icon: 'forum', route: '/' }, { label: 'Account', icon: 'person' , route: '/account'}
  ]
  clickedNavbuttonIndex = 0;
  private subscriptions = new Subscription();

  constructor(private router: Router) {
    this.subscriptions.add(this.router.events.subscribe(event => {
      if (!(event instanceof NavigationEnd)) return;
      this.clickedNavbuttonIndex = this.navButtons.findIndex(button => button.route === router.url);
    }));
  }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }
}
