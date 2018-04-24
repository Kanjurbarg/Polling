import { Component, OnInit } from '@angular/core';
import { FormsModule,FormGroup,FormBuilder,FormControl,Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, fromDocRef } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { UserService } from '../services/user.service';
import { Title } from '@angular/platform-browser';
import { AbstractControl } from '@angular/forms/src/model';
import { ValidationErrors } from '@angular/forms/src/directives/validators';




@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private authState: Observable<firebase.User>;
 

          
       rForm:FormGroup;


  

  constructor(
    private auth: AuthService,  
    private router: Router,
    private fb:FormBuilder,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private US:UserService,
    private title:Title
  ) { 
   
      this.rForm= fb.group({
        'display_name': new FormControl(null,[Validators.required,Validators.pattern('^[a-zA-Z\\s]*$')]),
        'email': new FormControl(null,[Validators.required,Validators.email]),
        'password': new FormControl(null,[Validators.required,Validators.minLength(8)]),
        'confirmPassword':new FormControl(null,Validators.required),
        
        'description': new FormControl(null,[Validators.required,Validators.minLength(10),Validators.maxLength(200)]),
        'contact': new FormControl(null,[Validators.required,Validators.pattern('[0-9]*'),Validators.minLength(10),Validators.maxLength(10)])
      });

  }

  ngOnInit() {

    this.title.setTitle("Registration Page");

  }

  get username() {
    return this.rForm.get('username');
  }
  get display_name() {
    return this.rForm.get('display_name');
  }
  get email() {
    return this.rForm.get('email');
  }
  get password() {
    return this.rForm.get('password');
  }
  get contact() {
    return this.rForm.get('contact');
  }
  get description() {
    return this.rForm.get('description');
  }



  register(rForm){
    console.log(rForm.value);
    const userData={
    name:this.display_name.value,
    username:this.username.value,
    email:this.email.value,
    password:this.password.value,
    description:this.description.value,
    contact:this.contact.value,
    }
    console.log(userData);
    this.auth.createAccount(userData);
    
  }


    }