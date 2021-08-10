import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DeviceTypeChecker } from 'src/app/device-type-checker.service';
import { HomeService } from '../home.service';
import { NavService } from '../nav-elements/nav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() menuClicked = new EventEmitter();
  private subscriptions = new Subscription();

  constructor(
    public navService: NavService,
    public deviceTypeChecker: DeviceTypeChecker,
    private changeDetector: ChangeDetectorRef,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(this.homeService.changes.subscribe(() => this.changeDetector.markForCheck()));
  }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }
}
