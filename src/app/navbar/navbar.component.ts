import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service'; 

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
userlogged;
  constructor(
    private auth:AuthService
  ) { }

  ngOnInit() {
    this.auth.getAuthState().subscribe(user =>{
      if(user){
        this.userlogged = user;
      console.log("navbar "+ user);
  
      }
      
    });
  }

}
