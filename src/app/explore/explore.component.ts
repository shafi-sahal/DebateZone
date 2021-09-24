import { ChangeDetectionStrategy, Component } from '@angular/core';
import { regexes } from '../shared/datasets';
import { ExploreService } from './explore.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
  providers: [ExploreService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExploreComponent {
  constructor(private exploreService: ExploreService) {}

  onInput(searchTerm: string): void {
    const isUsernameSearchTerm = searchTerm.includes('@') || searchTerm.includes('_') || searchTerm.includes('.');
    const regex = isUsernameSearchTerm ? regexes.usernameSearchTerm : regexes.searchTerm;
    if (!regex.test(searchTerm)) return;
    this.exploreService.fetchUsers(searchTerm).subscribe(users => console.log(users));
  }
}
