import { Component, OnInit } from '@angular/core';
import { FormsModule,FormGroup,FormBuilder,FormControl,Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, fromDocRef } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private authState: Observable<firebase.User>;
  email;
  name;
  password;
  username;
  description;
  contact;
  rForm:FormGroup;

  

  constructor(
    private auth: AuthService,  
    private router: Router,
    private fb:FormBuilder,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
  ) { 
   
      this.rForm= fb.group({
        'name': new FormControl(null,[Validators.required,Validators.pattern('^[a-zA-Z\\s]*$')]),
        'email': new FormControl(null,[Validators.required,Validators.email]),
        'password': new FormControl(null,[Validators.required,Validators.minLength(8)]),
        'username': new FormControl(null,[Validators.required,Validators.minLength(3)]),
        'description': new FormControl(null,[Validators.required,Validators.minLength(10),Validators.maxLength(200)]),
        'contact': new FormControl(null,[Validators.required,Validators.pattern('[0-9]*'),Validators.minLength(10),Validators.maxLength(10)])
      });

  }

  ngOnInit() {
    
 
  }
  
 

  register(rForm){
    console.log(rForm.value);
    this.name=rForm.name;
    this.username=rForm.username;
    this.email=rForm.email;
    this.password=rForm.password;
    this.description=rForm.description;
    this.contact=rForm.contact;
   /* this.auth.createAccount(this.email, this.password,this.username, this.description, this.contact);
    this.router.navigateByUrl('/dashboard');*/
  }


  
}
