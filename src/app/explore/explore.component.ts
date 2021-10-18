import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
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
export class ExploreComponent implements AfterViewInit{
  users: User[] = [];
  searchBar = new FormControl();

  constructor(
    private exploreService: ExploreService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngAfterViewInit():void {
    /*this.searchBar.valueChanges.subscribe((searchTerm: string) => {
      console.log(searchTerm.replace(regexes.nonUsernameChars, ''));
      //console.log(regexes.nonUsernameChars.exec(searchTerm));
    });*/
    this.searchBar.valueChanges.pipe(
      filter((searchTerm: string) => searchTerm.length > 0),
      //debounceTime(1000),
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
        console.log(searchTerm);
        if (!searchTerm.length) return of(null);
        return this.exploreService.fetchUsers(searchTerm);
      })
    ).subscribe(users => {
      if (users === null) return;
      this.users = users;
      this.changeDetector.markForCheck();
    });
  }
}
