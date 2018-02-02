import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email;
  password;
  username;
  description;
  contact;

  constructor(private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
 
  }

  register(){
    this.auth.createAccount(this.email, this.password, this.username, this.description, this.contact);
    this.router.navigateByUrl('/dashboard');
  }
}
