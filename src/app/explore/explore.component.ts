import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { regexes } from '../shared/datasets';
import { User } from '../shared/models/user.model';
import { ExploreService } from './explore.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
  providers: [ExploreService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExploreComponent {
  users: User[] = [];

  constructor(private exploreService: ExploreService, private changeDetector: ChangeDetectorRef) {}

  onInput(searchTerm: string): void {
    const isUsernameSearchTerm =
      searchTerm.includes('@') || searchTerm.includes('_') || searchTerm.includes('.') || /\d/.test(searchTerm)
    ;
    const regex = isUsernameSearchTerm ? regexes.usernameSearchTerm : regexes.searchTerm;
    if (!regex.test(searchTerm)) return;
    if (searchTerm.length === 1 && searchTerm.includes('@')) return;
    this.exploreService.fetchUsers(searchTerm).subscribe(users => {
      this.users = users;
      this.changeDetector.markForCheck();
    });
  }
}
