import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InitialDataLoader } from 'src/app/initial-data-loader.service';
import { NavService } from '../nav-elements/nav.service';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomNavComponent {
  constructor(public navService: NavService, public initialDataLoader: InitialDataLoader) { }
}
