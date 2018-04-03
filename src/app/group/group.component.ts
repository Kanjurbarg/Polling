import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../services/groups.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ElectionService } from '../services/election.service';
import { AuthService } from '../services/auth.service'
import { groupDetails } from '../models/groups.model'
import { UserService } from '../services/user.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import * as firebase from 'firebase/app';
import { PollService } from '../services/poll.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,FormGroup,FormBuilder,FormControl,Validators } from '@angular/forms';
import { forEach } from '@angular/router/src/utils/collection';
const now = new Date();
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  gName;
  gDescription;
  gAdmin;
  gDate:Date;
  gMembers=[];
  gid;
  admin;
  gTitle;
  adminID
  user=[]
  //group info
  groupInfo=[];

  //User Seach
  searchterm;
  users=[];

  startAt = new Subject();
  endAt = new Subject();

  startObs = this.startAt.asObservable();
  endAtObs = this.endAt.asObservable();

  //Poll Information
  pollTitle;
  pollDes;
  startDate:Date;
  endDate:Date;
  status;
  model: NgbDateStruct;
  date: {year: number, month: number};
  modalRef;
  duration:number;
  groupPolls=[];
  pollForm= new FormGroup({
    title: new FormControl('',Validators.required),
    des: new FormControl('',Validators.required),
    startDate: new FormControl('',Validators.required),
    endDate: new FormControl('',Validators.required),
  });

    constructor(
    private afs:AngularFirestore,
    private router:Router,
    private GS: GroupsService,
    private auth: AuthService,
    private route:ActivatedRoute,
    private US:UserService,
    private PS:PollService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {

     this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
  };
  
  this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
          this.router.navigated = false;
          window.scrollTo(0, 0);
      }
  });

    this.auth.getAuthState().subscribe(user=>{
      this.admin=user.uid;
    })

    //Get the router parameter
    this.route.paramMap.subscribe(params => {
      this.gid = params.get('gid');
      console.log("Group ID "+this.gid);
    });

    //get group information
    this.GS.getGroups(this.gid).subscribe(groups => {
      this.gTitle = groups.title;
      this.gDescription = groups.description;
      this.gDate = groups.createdOn;
      this.adminID = groups.admin;
      this.US.getUserDocument(this.adminID).subscribe(admin=>{
          this.gAdmin = admin.display_name;
      })
    });

    Observable.combineLatest(this.startObs, this.endAtObs).subscribe(
      value => {
        this.doQuery(value[0], value[1]).subscribe(
          users => {
            this.users=[];
            users.forEach(user=>{
              this.users.push(user);
            });
          });
      });
   
      this.GS.getMembers(this.gid).subscribe(members =>{ 
          console.log("outside "+ members);
          members.forEach((member:any) =>{
          this.user.push(member.memberID);
          //let memberID= member.memberID;
          this.gMembers= [];
          this.US.getUserDocument(member.memberID).subscribe(userDoc=>{
          this.gMembers.push(userDoc);  
        });
        
      });
        console.log(this.gMembers);

    });

    this.PS.getGroupPolls(this.gid).subscribe(polls=>{
      this.groupPolls=polls;
    });

  }//OnInit End
 
  logout(){
    this.auth.logout();
  }
 
  search($event) {
    const q = $event.target.value;
    this.startAt.next(q);
    this.endAt.next(q + '\uf8ff');
  }

  doQuery(start, end) {
    return this.afs.collection('users', ref => ref.limit(4).orderBy('username').startAt(start).endAt(end)).valueChanges();
  }

  addMember(uid){
    this.US.getUserDocument(uid).subscribe(member=>{
      const memberDetails={
        memberID:uid,
        addedOn: firebase.firestore.FieldValue.serverTimestamp(),
      }
        this.afs.doc('groups/'+ this.gid + '/members/' + uid).set(memberDetails).then(()=>{
          console.log("reload call");
          this.router.navigateByUrl('groups/'+this.gid);});
    });
    
  }
  
  createPoll()
  {
    const pollDetails={
      title:this.pollForm.get('title').value,
      des:this.pollForm.get('des').value,
      duration:this.duration,
      gid:this.gid
    };
    console.log(pollDetails);
    this.PS.createPolls(pollDetails);
    this.modalRef.close();
  }

  open(content) {
    this.modalRef=this.modalService.open(content);
  }

  goToPoll(pid){
    console.log("gotopoll"+ pid);
    this.router.navigateByUrl('poll/'+pid);
  }
  getDuration(duration){
    this.duration=null;
    if(duration == 1){
      this.duration=60;
    }
    if(duration == 2){
      this.duration=120;
    }
    if(duration == 3){
      this.duration=180;
    }
    if(duration == 4){
      this.duration=1440;
    }
    if(duration == 5){
      this.duration=2880;
    }
    console.log(this.duration);
    
  }

}
