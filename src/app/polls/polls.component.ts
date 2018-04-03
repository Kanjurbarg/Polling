import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { PollService } from '../services/poll.service'
import { GroupsService } from '../services/groups.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css']
})
export class PollsComponent implements OnInit {

  pid;
  gid;
  topic;
  description;
  status;
  displayContenders=[];
  pollContenders=[];
  contenders=[];
  contender=[];
  voters=[];
  user=[];
  gMembers=[];
  votes:number=0;


  constructor(
    private router:Router,
    private PS:PollService,
    private route:ActivatedRoute,
    private GS:GroupsService,
    private US:UserService,
    private afs:AngularFirestore
  ) { }

  ngOnInit() {

     //Get the router parameter
     this.route.paramMap.subscribe(params => {
      this.pid = params.get('pid');
      console.log("first Poll ID "+this.pid);
    });

    this.PS.getPoll(this.pid).subscribe((poll:any)=>{
      console.log(poll);
      this.topic= poll.title;
      this.description= poll.des;
      this.status=poll.status;
      this.gid=poll.gid;
      console.log( " Gid second "+ this.gid);

      this.GS.getMembers(this.gid).subscribe(members=>{
        //console.log("Member list"+members);
        members.forEach((member:any)=>{
          this.user.push(member.memberID);
          //console.log("MemberID "+this.user);
          this.gMembers=[];
          this.US.getUserDocument(member.memberID).subscribe(userDoc=>{
            this.gMembers.push(userDoc);
          });
        });
       // console.log(this.gMembers);
      });

      this.PS.getContenders(this.pid).subscribe(contenders=>{
        this.displayContenders=contenders;
        //console.log("displayContenders "+this.displayContenders);
        this.displayContenders.forEach((user:any)=>{
          //console.log("CID "+user.cid);
          this.US.getUserDocument(user.cid).subscribe(userDoc=>{
            //console.log("contenderInfo "+userDoc);
            this.pollContenders.push(userDoc);
           // console.log("All contenders "+this.pollContenders);
          });
          
        });
        
      });
    });
    
   
  }//ngOninit Ends

 getContender(contenderID){
  console.log("contederID" + contenderID);
  this.contenders.push(contenderID);
   this.US.getUserDocument(contenderID).subscribe(userDoc=>{
   // console.log("userDoc"+userDoc);
    this.contender.push(userDoc);
   // console.log("contenders list "+this.contender);
    const contenderDetails={
      cid:contenderID,
      votes:this.votes,
      pid:this.pid
    };
    this.PS.addContenders(contenderDetails);
    });    
 }

 startPoll(){
   console.log("status "+ this.pid);
   this.PS.updateStatus(this.pid);
   console.log("Voters ID"+this.user);
   this.user.forEach((voter:any)=>{ 
     this.PS.addVoters(voter,this.pid);
   });
   //this.PS.addVoters()
   
 }

}
