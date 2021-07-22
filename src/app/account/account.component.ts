import { Component, OnInit } from '@angular/core';
import { Spinner } from '../shared/components/spinner/spinner.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(private spinner: Spinner) { spinner.hide(); }

  ngOnInit(): void {
  }

}
