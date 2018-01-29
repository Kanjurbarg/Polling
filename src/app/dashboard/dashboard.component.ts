import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.auth.getAuthState().subscribe(
      user => {
        if (user) {
          console.log(user);
        } else {
          this.router.navigateByUrl('/login');
        }
      });
  }

  logout() {
    this.auth.logout();
  }

}
