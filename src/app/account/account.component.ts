import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UploadService } from '../services/upload.service';
import { FormsModule,FormGroup,FormBuilder,FormControl,Validators } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';

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
  isTaken =false;
  accountForm:FormGroup;

  
  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router,
    private titleService: Title,
    private uploadService:UploadService,
    private route:ActivatedRoute,
    private fb: FormBuilder,
    private afs:AngularFirestore
  ) {
    this.accountForm = fb.group({
      'displayName' : new FormControl('',[Validators.required,Validators.minLength(5)]),
      'userName': new FormControl('',[Validators.required,Validators.minLength(3)])
    });
   }

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

  search($event){
    const q = $event.target.value;
    this.checkUsername(q);
    console.log(q);
  }
  checkUsername(q){
    this.afs.collection('users/' , ref => ref.where('username','==',q)).valueChanges().subscribe(user=>{
      if(user[0]){
        this.isTaken = true;
      }
      else{
        this.isTaken = false;
      }
    });
  }


  update(formData){
    const data={
      uid:this.uid,
      display_name: this.display_name,
      username : this.username
    };
    this.userService.updateUser(data);
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
