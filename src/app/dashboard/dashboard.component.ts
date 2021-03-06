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
import { Title } from '@angular/platform-browser';


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
  memberGroups=[];

  groupTitle;
  groupDes;
  //My groupss
  adminGroups=[];

  //Polls
  pendingPolls=[];
  finishedPolls=[];
  ongoingPolls=[];

  groupForm:FormGroup;


  accountForm = new FormGroup({
    username : new FormControl('',[Validators.required,Validators.minLength(3)])
  });


  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router,
    private GS:GroupsService,
    private PS:PollService,
    private modalService: NgbModal,
    private title :Title,
    private fb:FormBuilder

  ) {
    this.groupForm = fb.group({
      'title': new FormControl(null,[Validators.required, Validators.minLength(6)]),
      'description': new FormControl(null,[Validators.required, Validators.minLength(20),Validators.maxLength(50)])
    });
   }

  ngOnInit() {
    this.title.setTitle('Dashboard');
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
              if(this.username === null){
                this.router.navigateByUrl('account/' + this.uid);
              }
          });
        } else {
          this.router.navigateByUrl('/login');
        }

        //Account Setup
        if(this.username === null){
            this.router.navigateByUrl('/account');
        }
        // Get Admin Groups
         this.GS.getMyGroups(user.uid).subscribe(myGroups => {
          this.adminGroups=myGroups;        
         });

         //Display Ongoing Polls
        this.userService.ongoingFeed(user.uid).subscribe(polls=>{       
           polls.forEach((poll:any)=>{
             this.ongoingPolls= [];
             this.PS.getPoll(poll.pid).subscribe(Ofeed=>{
              this.ongoingPolls.push(Ofeed);
               
             });
           });        
        });
        //Display Finished Polls
        this.userService.finishedFeed(user.uid).subscribe(polls=>{       
          polls.forEach((poll:any)=>{
            this.ongoingPolls= [];
            this.PS.getPoll(poll.pid).subscribe(Ffeed=>{
              this.finishedPolls.push( Ffeed);
             
            });
          });        
       });

       this.userService.getMemberGroups(user.uid).subscribe(groups=>{
        groups.forEach((group:any)=>{
          this.GS.getGroups(group.gid).subscribe(memberOf=>{
            this.memberGroups.push(memberOf);
            
          });
        });
       });
       this.userService.pendingPolls(user.uid).subscribe(polls =>{
        polls.forEach((poll:any)=>{
          this.pendingPolls=[];
          this.PS.getPoll(poll.pid).subscribe(pending =>{
            this.pendingPolls.push(pending);
          });
        });
     
       });

 });
     
  }

  logout() {
    this.auth.logout();
    location.reload();
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
