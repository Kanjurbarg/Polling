import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service'; 
import { UserService } from '../services/user.service';
import { PollService } from '../services/poll.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
userlogged;
pendingPolls;
uid;
length;
  constructor(
    private auth:AuthService,
    private US:UserService,
    private PS:PollService,
    private router:Router

  ) { }

  ngOnInit() {
    this.auth.getAuthState().subscribe(user =>{
      if(user){
        this.userlogged = user;
      console.log("navbar "+ user);
          this.uid = user.uid;
          this.pendingPolls=[];
        this.US.pendingPolls(this.uid).subscribe(polls =>{
          polls.forEach((poll:any) =>{
            this.PS.getPoll(poll.pid).subscribe(pending =>{
              this.pendingPolls.push(pending);
              this.length = this.pendingPolls.length;
            }); 
          });
  
        });

      }  
    });
  }


  goTo(type){
    if(type === 'account'){
      this.router.navigateByUrl('account/' + this.uid);
    }
    if(type === 'about'){
      this.router.navigateByUrl('about');
    }
    if(type === 'logout'){
      this.auth.logout();
    }
    if(type === 'feedback'){
      this.router.navigateByUrl('feedback/' + this.uid);
    }
  }

}
