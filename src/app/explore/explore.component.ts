import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
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
      //debounceTime(1000),
      switchMap((searchTerm: string) => {
        const isUsernameSearchTerm =
          searchTerm.includes('@') || searchTerm.includes('_') || searchTerm.includes('.') || /\d/.test(searchTerm)
        ;

        if (isUsernameSearchTerm) {
          searchTerm = searchTerm.replace(regexes.nonUsernameChars, '');
          if (searchTerm.length > 30) searchTerm = searchTerm.slice(0, 30);
        }
        console.log(searchTerm);

        return this.exploreService.fetchUsers(searchTerm);
      })
    ).subscribe(users => {
      this.users = users;
      this.changeDetector.markForCheck();
    });
  }

  /*onInput(searchTerm: string): void {
    const isUsernameSearchTerm =
      searchTerm.includes('@') || searchTerm.includes('_') || searchTerm.includes('.') || /\d/.test(searchTerm)
    ;
    const regex = isUsernameSearchTerm ? regexes.usernameSearchTerm : regexes.searchTerm;
    if (!regex.test(searchTerm)) return;
    if (searchTerm.length === 1 && searchTerm.includes('@')) return;
    this.searchBar.valueChanges.pipe(
      debounceTime(1000),
      switchMap(searchTerm => this.exploreService.fetchUsers(searchTerm))
    ).subscribe(users => {
      this.users = users;
      this.changeDetector.markForCheck();
    });
    /*this.exploreService.fetchUsers(searchTerm).subscribe(users => {
      this.users = users;
      this.changeDetector.markForCheck();
    });
  }*/
}
