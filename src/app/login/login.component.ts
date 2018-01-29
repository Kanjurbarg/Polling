import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.auth.getAuthState().subscribe(
      user => {
        if (user) {
          this.router.navigateByUrl('/dashboard');
        }
      });
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
