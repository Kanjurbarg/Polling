import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email;
  password;

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
      this.auth.emailLogin(this.email, this.password);
    }
    if(type === 'create'){
      this.router.navigateByUrl('/register');
    }
  }
}
