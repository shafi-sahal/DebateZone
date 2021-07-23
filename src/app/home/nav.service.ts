import { Injectable } from '@angular/core';

@Injectable()
export class NavService {
  navButtons: { label: string, icon: string, route: string }[] = [
    { label: 'Debates', icon: 'forum', route: '' }, { label: 'Account', icon: 'person' , route: 'account'}
  ]
  clickedNavbuttonIndex = 0;
}
