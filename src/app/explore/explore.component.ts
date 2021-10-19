import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { debounceTime, filter, switchMap} from 'rxjs/operators';
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
export class ExploreComponent implements AfterViewInit, OnDestroy{
  users: User[] = [];
  searchBar = new FormControl();
  private subscriptions = new Subscription();

  constructor(
    private exploreService: ExploreService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.initSearchBar();
  }

  trackByFunction(index: number, user: User): string {
    return user.username;
  }

  private initSearchBar(): void {
    let searchTermCache = '';
    this.subscriptions.add(this.searchBar.valueChanges.pipe(
      filter((searchTerm: string) => searchTerm.length > 0),
      debounceTime(1000),
      switchMap((searchTerm: string) => {
        searchTerm = searchTerm.trim();
        const isUsernameSearchTerm =
          searchTerm.includes('@') || searchTerm.includes('_') || searchTerm.includes('.') || /\d/.test(searchTerm)
        ;

        if (isUsernameSearchTerm) {
          searchTerm = searchTerm.replace(regexes.nonUsernameChars, '');
          if (searchTerm.length > 30) searchTerm = searchTerm.slice(0, 30);
        } else {
          searchTerm = searchTerm.replace(regexes.nonNameChars, '');
        }
        if (searchTerm === searchTermCache || !searchTerm.length) return of(null);
        searchTermCache = searchTerm;
        return this.exploreService.fetchUsers(searchTerm);
      })
    ).subscribe(users => {
      if (users === null) return;
      this.users = users;
      this.changeDetector.markForCheck();
    }));
  }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }
}
