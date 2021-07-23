import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable()
export class NavService  {
  navButtons: { label: string, icon: string, route: string }[] = [
    { label: 'Debates', icon: 'forum', route: '' }, { label: 'Account', icon: 'person' , route: 'account'}
  ]
  clickedNavbuttonIndex = 0;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (!(event instanceof NavigationEnd)) return;
      const route = router.url.replace('/', '');
      const buttonIndex = this.navButtons.findIndex(button => button.route === route);
      this.clickedNavbuttonIndex = buttonIndex;
    });
  }
}
