import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  display_name='Enter Your Name';
  username = 'Enter Your Username';
  desc = 'Enter Description';
  filename = 'Change Picture';
  photoURL = '../../assets/images/default-profile_pic.jpg';
  uid;
  inputFile;
  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router,
    private titleService: Title,
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Account');
    this.auth.getAuthState().subscribe(
      user => {      
        if (user) {
         // console.log("first: "+user.emailVerified);
         // var emailVerified=user.emailVerified;
          //console.log("second: "+emailVerified);
          this.userService.getUserDocument(user.uid).subscribe(
            userDoc => { 
              this.uid = userDoc.uid
              this.username = userDoc.username ? userDoc.username : null;
              this.display_name = userDoc.display_name;
              this.desc = userDoc.desc;
              this.photoURL = userDoc.photoURL ?  userDoc.photoURL : 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg'; 
          });
        }
  

  });

  }

  update(){
    this.userService.updateUser(this.uid, this.display_name, this.username, this.desc);
  }
  processImage(event){
    
  }
}
