import { Component, OnInit, ElementRef } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { PollService } from '../services/poll.service'
import { GroupsService } from '../services/groups.service';
import { UserService } from '../services/user.service';
import { Time } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { DatePipeService } from '../services/date-pipe.service';
import * as firebase from 'firebase/app';




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
voter;
contenders;
displayContenders;
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
contender;
resultSet;
myChart;
createdOn;
setupPoll;
type:string;
choiceList;
opinionVoter;
doughnutChartLabels:string[];
doughnutChartData:number[] ;
doughnutChartType:string ;
labels=[];
votes=[];
contenderLabels=[];
votesLabel=[];
votedMembers=[];


  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private PS:PollService,
    private US:UserService,
    private GS:GroupsService,
    private auth:AuthService,
    private elementRef: ElementRef,
    private dateForamt:  DatePipeService,


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
      {
      this.title = pollInfo.title,
      this.description = pollInfo.des,
      this.status = pollInfo.status;
      this.createdOn = pollInfo.createdOn,
      this.startDate = pollInfo.startedOn,
      this.duration = pollInfo.duration;
      this.gid = pollInfo.gid;
      this.type = pollInfo.type;
      this.checkStatus();
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


      if(this.status === 'finished'){
        this.getResult(this.pid);
      }
         //Chart code start
    
    if(this.type === 'opinion'){
      this.doughnutChartLabels = this.labels;
      this.doughnutChartData= this.votes;
      this.doughnutChartType= 'doughnut';
     }
     else{
       this.doughnutChartLabels = this.contenderLabels;
       this.doughnutChartData= this.votesLabel;
       this.doughnutChartType= 'doughnut';
     }
  
     // Chart code End


      // Voter Status Election
      this.PS.voterStatus(this.pid, this.currentUser).subscribe((status:any)=>{
       this.voterStatus=status;
      });
      // Voter Status Opinion
      this.PS.choiceVoterStatus(this.pid, this.currentUser).subscribe((status:any)=>{
        this.opinionVoter = status;
      });

      // Voters List
      this.PS.getVoters(this.pid).subscribe(members =>{
        members.forEach((member:any) =>{
        this.user.push(member.vid);
        this.US.getUserDocument(member.vid).subscribe(userDoc=>{
          this.gMembers.push(userDoc);      
      });
    });
  });
    });

    this.PS.getContenders(this.pid).subscribe(contenders=>{
      this.contenders=contenders;
      this.contenders.forEach((contender:any)=>{
        this.displayContenders=[];
        this.votesLabel.push(contender.votes);
        this.US.getUserDocument(contender.cid).subscribe(userDoc=>{
          this.displayContenders.push(userDoc);
          this.contenderLabels.push(userDoc.username);
        });

      });
    });
      this.PS.getChoices(this.pid).subscribe(list=>{
        this.choiceList = list;
        this.choiceList.forEach(name=>{
         this.labels.push(name.choice);
         this.votes.push(name.votes);
        });
      });

      this.PS.getVoted(this.pid).subscribe(list =>{
        console.log("voted"+list);
        list.forEach((voter:any) =>{
          this.US.getUserDocument(voter.uid).subscribe(userDoc=>{
            this.votedMembers.push(userDoc);
            console.log(this.votedMembers);
          });
        });
      });

    this.PS.displayVoters(this.pid).subscribe((voterDoc:any)=>{
      this.voter=voterDoc;
      this.voter.forEach((voterInfo:any)=>{
        this.US.getUserDocument(voterInfo.uid).subscribe(userDoc=>{
          this.voters.push(userDoc);
        });
      });
    });

    if(this.type === 'opinion'){
      if(this.gMembers.length === this.votedMembers.length){
        this.PS.endPoll(this.pid);
        location.reload();
      }
    }


  }//Oninit ends

  checkStatus() {
    const createdTime: any = new Date(this.startDate).getMilliseconds();
    const currentTime: any = new Date().getMilliseconds();
    this.timer = currentTime - createdTime;
    const duration = (this.duration * 60000);
    if (this.timer <= 0 && this.status === 'ongoing') {
      console.log('Poll Finished');
      this.PS.endPoll(this.pid);
      location.reload();
    } else {
      console.log('Poll Ongoing');
      console.log('Time remaining- ', this.timer);
      console.log('duration ', duration);
    }
  }

    registerVote(cid){
      const data={
        cid:cid,
        uid:this.currentUser,
        pid:this.pid,
      };
      this.PS.registerVoter(data);
    }


  getResult(pid){
    this.PS.displayResult(pid).subscribe(results=>{
      this.results=results;
    });

  }
  getDate(date){
      return this.dateForamt.transform(date);
  }

 
}
