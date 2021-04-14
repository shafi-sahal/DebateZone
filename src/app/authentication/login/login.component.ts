import { Component, OnInit } from '@angular/core';
import { CredentialsService } from 'src/app/services/credentials.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../common_styles/login-and-signup.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public credentialsService: CredentialsService) { }

  ngOnInit(): void {
  }

}
