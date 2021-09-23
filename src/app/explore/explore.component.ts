import { ChangeDetectionStrategy, Component } from '@angular/core';
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
    this.exploreService.fetchUsers(searchTerm).subscribe(users => console.log(users));
  }
}
