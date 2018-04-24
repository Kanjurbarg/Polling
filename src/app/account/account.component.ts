import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UploadService } from '../services/upload.service';

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
    private uploadService:UploadService,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Account');
    this.route.paramMap.subscribe(params=>{
      this.uid = params.get('uid');
    });

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
    this.inputFile = event.target.files[0];
    this.filename = this.inputFile.name;
    if (this.inputFile.size > 2000000) {
      this.filename = 'Max Filesize 2Mb!';
    } else {
      if (this.filename.length > 25) {
        this.filename = this.filename.slice(0, 25) + '...' + this.filename.slice(this.filename.length - 3);
      }
      this.uploadService.pushUpload(this.inputFile, 'user', this.uid);
    }
  }
}
