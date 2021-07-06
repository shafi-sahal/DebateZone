import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Spinner } from '../shared/components/spinner/spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  mode = 'closed';
  isMobile = true;

  constructor(
    private spinner: Spinner,
    private router: Router
  ) { this.spinner.hide(); }


  ngAfterViewInit():void {
    console.log(window.innerWidth);

  }

  onMenuClick():void {
    this.sidenav.toggle();
  }
  onClickLogout(): void { this.router.navigate(['authentication']); }
}
