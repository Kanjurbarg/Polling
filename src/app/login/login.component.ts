import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
  }

  login(type) {
    if (type === 'google') {
      this.auth.googleLogin();
    }
    if (type === 'email') {
      alert('no email login yet.');
    }
  }
}
