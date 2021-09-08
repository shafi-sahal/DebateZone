import { Injectable } from '@angular/core';


@Injectable()
export class NavService {
  navButtons: { label: string, icon?: string, route: string }[] = [
    { label: 'Debates', icon: 'forum', route: '/' },
    { label: 'Explore', icon: 'search',route: '/explore' },
    { label: 'Account', icon: 'person', route: '/account'},
    { label: 'Create a Debate', route: '/create-debate' }
  ];
  clickedNavbuttonIndex = 0;
}
