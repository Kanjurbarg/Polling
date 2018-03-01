import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // User info
  username;
  display_name;
  desc;
  photoURL;
  joinDate;
  verified;



  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.auth.getAuthState().subscribe(
      user => {
       // var emailVerified=user.emailVerified;
         
        if (user) {
          console.log(user.emailVerified);
          this.userService.getUserDocument(user.uid).subscribe(
            userDoc => {
              this.username = userDoc.username ? userDoc.username : null;
              this.display_name = userDoc.display_name;
              this.desc = userDoc.desc;
              this.photoURL = userDoc.photoURL ?  userDoc.photoURL : 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg';
              this.joinDate = userDoc.joinDate;
              //this.verified =userDoc.emailVerified; 
          });
        } else {
          this.router.navigateByUrl('/login');
        }
      });
  }

  logout() {
    this.auth.logout();
  }

}
