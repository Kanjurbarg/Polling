import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PollService } from '../services/poll.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-contender',
  templateUrl: './contender.component.html',
  styleUrls: ['./contender.component.css']
})
export class ContenderComponent implements OnInit {

  @Input() results;
  @Input() contender;
  @Input() rank;
  @Input() pollContender;
  uid;
  desc;
  name;
  photoURL;
  username;
  totalVotes;
  userDocs;
  pid;
  currentUser;
  voterStatus;

  voteBtn;


  constructor(
    private userService: UserService,
    private router:Router,
    private route:ActivatedRoute,
    private PS:PollService,
    private auth:AuthService
  ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      this.pid = params.get('pid');    
    });
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
  };

    this.auth.getAuthState().subscribe(user=>{
      this.currentUser= user.uid;

      this.PS.voterStatus(this.pid,this.currentUser).subscribe(voter=>{
        this.voterStatus = voter;
       
  
        if(voter){
          this.voteBtn="content:'You have Voted '; ";
        }
      });
   
    });

  
    if(this.contender){
      this.uid=this.contender.cid;

    }

    if(this.results){
      this.uid = this.results.cid;
    this.totalVotes = this.results.votes;
    }
    
    if(this.pollContender){
      this.uid = this.pollContender.cid;
    }

    this.userService.getUserDocument(this.uid).subscribe(userDoc=>{
      console.log(userDoc);
      this.name = userDoc.display_name;
      this.username = userDoc.username;
      this.photoURL = userDoc.photoURL;
    });

  }

  vote(vote){
    const preVote={
      cid:vote,
      pid:this.pid,
    };
    
    this.PS.addVoter(this.pid,vote);
    this.router.navigateByUrl('voting/' + this.pid);
    this.PS.addVote(preVote);
  }

}
