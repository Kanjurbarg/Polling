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
title;
description;
voters=[];
voter=[];
contenders=[];
displayContenders=[];
status;
startDate:Date;
startTime:Time;
duration:Time;
currentUser;
  constructor( 
    private router:Router,
    private route:ActivatedRoute,
    private PS:PollService,
    private US:UserService,
    private GS:GroupsService,
    private auth:AuthService
  ) { }

  ngOnInit(){
    this.auth.getAuthState().subscribe((user:any)=>{
      this.currentUser=user.uid;
      console.log('Current user '+ this.currentUser);
    });
     //Get the router parameter
     this.route.paramMap.subscribe(params => {
      this.pid = params.get('pid');
      console.log("Poll ID "+this.pid);
      
    });
   
    
    this.PS.getPoll(this.pid).subscribe((pollInfo:any)=>{
      this.title=pollInfo.title,
      this.description=pollInfo.des,
      this.status=pollInfo.status;
      this.startDate=pollInfo.startedOn,
      this.duration=pollInfo.duration;
    });

    this.PS.getContenders(this.pid).subscribe(contenders=>{
     // console.log("Obervable" + contenders);
      this.contenders=contenders;
     // console.log("Array" + this.contenders);
      this.contenders.forEach((contender:any)=>{
        //console.log("CID " + contender.cid);
        this.displayContenders=[];
        this.US.getUserDocument(contender.cid).subscribe(userDoc=>{
         // console.log("UserDoc" + userDoc);
          this.displayContenders.push(userDoc);
          //console.log("Contenders Doc" + this.displayContenders);
        });
        
      });
    });

    this.PS.displayVoters(this.pid).subscribe((voterDoc:any)=>{
      //console.log("voterDoc "+ voterDoc);
      this.voter=voterDoc;
      //console.log("Voter Array"+ this.voter);
      this.voter.forEach((voterInfo:any)=>{
       // console.log("VoterInfo"+ voterInfo);
       // console.log("voter id "+ voterInfo.vid);
        this.US.getUserDocument(voterInfo.vid).subscribe(userDoc=>{
         // console.log("UserDoc"+ userDoc);
          this.voters.push(userDoc);
          //console.log("Voters list "+this.voters);
        });
      });
    });

  }//Oninit ends

  vote(vote){
    console.log("CID "+ vote);
    const voteDetails={
      cid:vote,
      pid:this.pid,
      voterID:this.currentUser
    };
    this.PS.registerVote(voteDetails);
  }

}
