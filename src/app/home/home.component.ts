import { Component, OnInit } from '@angular/core';
import { Spinner } from '../shared/components/spinner/spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private spinner: Spinner
  ) { this.spinner.hide(); }

  ngOnInit(): void {
    //this.spinner.hide();
  }

}
