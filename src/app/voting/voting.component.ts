import { Component, OnInit, ElementRef } from '@angular/core';
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
myChart;
createdOn;
setupPoll;
type:string;
choiceList;
opinionVoter
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private PS:PollService,
    private US:UserService,
    private GS:GroupsService,
    private auth:AuthService,
    private elementRef: ElementRef
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
      if(pollInfo.type === 'election')
      {this.title = pollInfo.title,
      this.description = pollInfo.des,
      this.status = pollInfo.status;
      this.createdOn = pollInfo.createdOn,
      this.startDate = pollInfo.startedOn,
      this.duration = pollInfo.duration;
      this.gid = pollInfo.gid;
      this.type = pollInfo.type;
    }

      if(pollInfo.type === 'opinion'){
      this.title = pollInfo.title,
      this.description = pollInfo.des,
      this.status = pollInfo.status,
      this.createdOn = pollInfo.createdOn,
      this.startDate = pollInfo.startedOn,
      this.gid = pollInfo.gid;
      this.type = pollInfo.type;
      }

      if (this.status === 'ongoing') {
        this.checkStatus();
      }

      if(this.status === 'finished'){
        this.getResult(this.pid);
      }

      if(this.status === 'onging')


      // Voter Status Election
      this.PS.voterStatus(this.pid, this.currentUser).subscribe((status:any)=>{
       this.voterStatus=status;
      });
      // Voter Status Opinion
      this.PS.choiceVoterStatus(this.pid, this.currentUser).subscribe((status:any)=>{
        console.log(status);
        this.opinionVoter = status;
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

      this.PS.getChoices(this.pid).subscribe(list=>{
        this.choiceList = list;
      });

    this.PS.displayVoters(this.pid).subscribe((voterDoc:any)=>{
      this.voter=voterDoc;
      this.voter.forEach((voterInfo:any)=>{
        this.US.getUserDocument(voterInfo.uid).subscribe(userDoc=>{
          this.voters.push(userDoc);
        });
      });
    });

    //Chart code start
    
  
    //this.chartit();
    
    // Chart code End




  }//Oninit ends

  checkStatus() {
    const createdTime: any = new Date(this.startDate);
    const currentTime: any = new Date();
    this.timer = currentTime - createdTime;
    console.log("Timer"+this.timer);
    console.log(this.duration*360000);
    if (this.duration * 3600000 <= this.timer) {
      console.log('Poll Finished');
      this.PS.endPoll(this.pid);
    } else {
      console.log('Poll Ongoing');
      console.log('Time remaining- ', this.timer / 3600000, 'hrs');
    }
  }

    registerVote(cid){
      const data={
        cid:cid,
        uid:this.currentUser,
        pid:this.pid
      };
      this.PS.registerVoter(data);
    }


  getResult(pid){
    this.PS.displayResult(pid).subscribe(results=>{
      this.results=results;
      console.log(results);
    
    });

  }

 
}
