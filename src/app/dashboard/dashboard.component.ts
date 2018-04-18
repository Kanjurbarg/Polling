import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import {GroupsService} from '../services/groups.service';
import { PollService } from '../services/poll.service';
import { Observable } from 'rxjs/Observable';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,FormGroup,FormBuilder,FormControl,Validators } from '@angular/forms';
import { groupDetails } from '../models/groups.model'


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

  groupTitle;
  groupDes;
  //My groupss
  adminGroups=[];

  //Polls
  pendingPolls=[];
  ongoingPolls=[];

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

        // Get Admin Groups
         this.GS.getMyGroups(user.uid).subscribe(myGroups => {
          this.adminGroups=myGroups;        
         });

         //Display Ongoing Polls
        this.userService.opinionFeed(user.uid).subscribe(polls=>{       
           polls.forEach((poll:any)=>{
             this.PS.getPoll(poll.pid).subscribe(feed=>{
               console.log(feed);
             });
           });        
        });
        //Display Finished Polls

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

 /* showMyGroup(uid){
    this.GS.getMyGroups(uid);
  }*/


  showPendingPolls(){
    this.router.navigateByUrl('/poll');
  }

  open(content) {
    this.modalRef=this.modalService.open(content);
  }

}
