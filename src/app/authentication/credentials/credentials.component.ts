import { Component, OnInit } from '@angular/core';
import { CredentialsService } from 'src/app/services/credentials.service';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit {

  constructor(public credentialsService: CredentialsService) { }

  ngOnInit(): void {
  }

}
