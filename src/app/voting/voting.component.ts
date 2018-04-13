import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { PollService } from '../services/poll.service'
import { GroupsService } from '../services/groups.service';
import { UserService } from '../services/user.service';
import { Time } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit {
pid;
gid;
title;
description;
voters=[];
voter=[];
contenders=[];
displayContenders=[];
user=[];
gMembers=[];
status;
startDate:Date;
startTime:Time;
duration:number;
currentUser;
voterStatus;
voteCounter:number;
results;
resultSet;
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private PS:PollService,
    private US:UserService,
    private GS:GroupsService,
    private auth:AuthService
  ) { }

  timer;

  ngOnInit(){

    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
  };
    this.auth.getAuthState().subscribe((user:any)=>{
      this.currentUser=user.uid;
    });
     //Get the router parameter
     this.route.paramMap.subscribe(params => {
      this.pid = params.get('pid');

    });



    this.PS.getPoll(this.pid).subscribe((pollInfo:any)=>{
      this.title = pollInfo.title,
      this.description = pollInfo.des,
      this.status = pollInfo.status;
      this.startDate = pollInfo.startedOn,
      this.duration = pollInfo.duration;
      this.gid = pollInfo.gid;
      if (this.status === 'ongoing') {
        console.log
        this.checkStatus();
      }

      if(this.status === 'finished'){
        this.getResult(this.pid);
      }
      // Voter Status
      this.PS.voterStatus(this.pid, this.currentUser).subscribe((status:any)=>{
       this.voterStatus=status;
      });

      // Voters List
      this.GS.getMembers(this.gid).subscribe(members =>{
        members.forEach((member:any) =>{
        this.user.push(member.memberID);
        // let memberID= member.memberID;
        this.gMembers = [];
        this.US.getUserDocument(member.memberID).subscribe(userDoc=>{
        this.gMembers.push(userDoc);
      });

    });

  });


    });

    this.PS.getContenders(this.pid).subscribe(contenders=>{
      this.contenders=contenders;
      
      this.contenders.forEach((contender:any)=>{
        this.displayContenders=[];
        this.US.getUserDocument(contender.cid).subscribe(userDoc=>{
          this.displayContenders.push(userDoc);
        });

      });
    });

    this.PS.displayVoters(this.pid).subscribe((voterDoc:any)=>{
      this.voter=voterDoc;
      console.log(voterDoc);
      this.voter.forEach((voterInfo:any)=>{
        this.US.getUserDocument(voterInfo.uid).subscribe(userDoc=>{
          this.voters.push(userDoc);
          console.log(userDoc);
        });
      });
    });



  }//Oninit ends

  checkStatus() {
    const createdTime: any = new Date(this.startDate);
    const currentTime: any = new Date();
    this.timer = currentTime - createdTime;
    if (this.duration * 3600000 <= this.timer) {
      console.log('Poll Finished');
      this.PS.endPoll(this.pid);
    } else {
      console.log('Poll Ongoing');
      console.log('Time remaining- ', this.timer / 3600000, 'hrs');
    }
  }

 


  getResult(pid){
    this.PS.displayResult(pid).subscribe(results=>{
      this.results=results;
      console.log(results);
    
    });

  }
}
