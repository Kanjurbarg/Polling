import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, fromDocRef } from 'angularfire2/firestore';
import { FormsModule,FormGroup,FormBuilder,FormControl,Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Title } from '@angular/platform-browser';
import { AbstractControl } from '@angular/forms/src/model';
import { ValidationErrors } from '@angular/forms/src/directives/validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   // email;
    // password;
  rForm:FormGroup
  constructor(
    private auth: AuthService,
    private router: Router,
    private US:UserService,
    private fb:FormBuilder
  ) { 

    this.rForm=fb.group({
      'email': new FormControl(null,[Validators.required,Validators.email]),
      'password':new FormControl(null,Validators.required)
    });
  }

  get email(){
    return this.rForm.get('email');
  }

  get password()
  {
    return this.rForm.get('password');
  }


  ngOnInit() {
    this.auth.getAuthState().subscribe(
      user => {
        if(user){
          
        }
      });
  }

  login(type) {
    if (type === 'google') {
      this.auth.googleLogin();
    }
    if (type === 'email') {
      console.log(this.email.value+" "+ this.password.value);
      this.auth.emailLogin(this.email.value, this.password.value);
     
    }
    if(type === 'create'){
      this.router.navigateByUrl('/register');
    }
  }
}
