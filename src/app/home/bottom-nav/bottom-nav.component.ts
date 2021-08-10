import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { HomeService } from '../home.service';
import { NavService } from '../nav-elements/nav.service';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomNavComponent {
  constructor(public navService: NavService, public homeService: HomeService) { }
}
