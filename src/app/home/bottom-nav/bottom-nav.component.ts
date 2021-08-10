import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HomeService } from '../home.service';
import { NavService } from '../nav-elements/nav.service';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomNavComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  constructor(public navService: NavService, public homeService: HomeService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.homeService.changes.subscribe(() => this.changeDetector.markForCheck());
  }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }
}
