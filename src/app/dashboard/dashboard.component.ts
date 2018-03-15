import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import {GroupsService} from '../services/groups.service';
import { PollService } from '../services/poll.service';
import { Observable } from 'rxjs/Observable';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,FormGroup,FormBuilder,FormControl,Validators } from '@angular/forms';


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
  uid;
  modalRef;

  //Polls
  pendingPolls=[];

  groupForm=new FormGroup({
    title: new FormControl('',[Validators.required,Validators.minLength(6)]),
    description: new FormControl('',[Validators.required,Validators.minLength(12)]),
  });


  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router,
    private GS:GroupsService,
    private PS:PollService,
    private modalService: NgbModal

  ) { }

  ngOnInit() {
    this.auth.getAuthState().subscribe(
      user => {
              
        if (user) {
         // console.log("first: "+user.emailVerified);
         // var emailVerified=user.emailVerified;
          //console.log("second: "+emailVerified);
          this.userService.getUserDocument(user.uid).subscribe(
            userDoc => {
              this.uid=userDoc.uid,
              this.username = userDoc.username ? userDoc.username : null;
              this.display_name = userDoc.display_name;
              this.desc = userDoc.desc;
              this.photoURL = userDoc.photoURL ?  userDoc.photoURL : 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg';
              this.joinDate = userDoc.joinDate;
              this.verified =user.emailVerified; 
          });
        } else {
          this.router.navigateByUrl('/login');
        }
      });

      //Get Polls Info
      this.PS.getPoll().subscribe(poll =>{
        
      });

     
  }

  logout() {
    this.auth.logout();
  }

 createGroup(){
   const groupData={
      title:this.groupForm.get('title').value,
      description: this.groupForm.get('description').value
   };

   this.GS.createGroup(groupData);
   this.modalRef.close();
  }

  showPendingPolls(){
    this.router.navigateByUrl('/poll');
  }


  open(content) {
    this.modalRef=this.modalService.open(content);
  }

}
