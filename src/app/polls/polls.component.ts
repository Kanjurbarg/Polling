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
  duration;
  displayContenders;
  pollContenders=[];
  contenders=[];
  contender=[];
  voters=[];
  user=[];
  gMembers=[];
  votes:number=0;
  statBtn;


  constructor(
    private router:Router,
    private PS:PollService,
    private route:ActivatedRoute,
    private GS:GroupsService,
    private US:UserService,
    private afs:AngularFirestore
  ) { }

  ngOnInit(){

    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
  };
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
      this.duration=poll.duration;
      if(this.status === 'ongoing'){
        this.router.navigateByUrl('voting/' + this.pid);
      }

      this.GS.getMembers(this.gid).subscribe(members=>{
        members.forEach((member:any)=>{
          this.user.push(member.memberID);
          this.gMembers=[];
          this.US.getUserDocument(member.memberID).subscribe(userDoc=>{
            this.gMembers.push(userDoc);
          });
        });
      });

      this.PS.getContenders(this.pid).subscribe(chooseContenders=>{
        this.displayContenders=chooseContenders;
        this.displayContenders.forEach((user:any)=>{
          this.US.getUserDocument(user.cid).subscribe(userDoc=>{
            this.pollContenders.push(userDoc);
          });
          
        });
        
      });


    });
    
   
  }//ngOninit Ends

 getContender(contenderID){
   this.US.getUserDocument(contenderID).subscribe(userDoc=>{
  
    const contenderDetails={
      cid:contenderID,
      votes:this.votes,
      pid:this.pid
    };
    this.PS.addContenders(contenderDetails);
    });    
 }

  finishPoll(){
      this.PS.endPoll(this.pid);
  }
 startPoll(){
   this.PS.updateStatus(this.pid);
    this.router.navigateByUrl('poll/' + this.pid);

 }

}
