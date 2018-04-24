import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, fromDocRef } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  private authState: Observable<firebase.User>;
  private updateData;
 
  currentUser;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.authState = this.afAuth.authState;
    this.authState.subscribe(user => {
      if (user) {
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
  }

  getAuthState() {
    return this.authState;
  }

  emailLogin(email, password) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(() => this.checkUser())
    .catch(() => {
      this.router.navigateByUrl("/login");      /*this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(() => this.checkUser());*/
    });
  }

  googleLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(() => this.checkUserGoogle())
    .catch(err => console.log(err));
  }

 
  createAccount(userData){
    console.log(userData);
    this.afAuth.auth.createUserWithEmailAndPassword(userData.email, userData.password)
      .then(() => {
        this.getAuthState().subscribe(user=>{
          if(user){
            console.log(user);
            const data={  
              email: userData.email,
              uid: user.uid,
              display_name: userData.name,
              username: '',
              phone: userData.contact ? userData.contact : null,
              photoURL: user.photoURL ? user.photoURL:null,
              joinDate: firebase.firestore.FieldValue.serverTimestamp(),
              //emailVerified: user.emailVerified
            };
            //Verifivation Email.
            user.sendEmailVerification().then(function() {
              console.log("verification email Sent...");
            }).catch(function(error) {
              console.log(error);
            });

            //Inserting userData to Database
            this.afs.doc('users/'+ user.uid).set(data).then(()=>{
              this.router.navigateByUrl('/login');
              alert('Please Verify Your Account....');
            })
          }
        })
      })
      .catch((err) => console.log(err));
  
  }

  checkUserGoogle() {
    this.authState.subscribe(user => {
      const uid = user.uid;
      this.afs.doc('users/' + uid).valueChanges().subscribe(
        userDoc => {
          if (userDoc) {
            this.router.navigateByUrl('/dashboard');
          } else {
            this.insertUser();
          }
        });
    });
  }
  checkUser() {
    this.authState.subscribe(user => {
      if(user){
      const uid = user.uid;
      const verified =user.emailVerified;
      console.log(verified+" "+user.emailVerified);
      console.log('registering user');
      this.afs.doc('users/' + uid).valueChanges().subscribe(
        userDoc => {
          if (userDoc) {

              if(!verified){
                  alert("Your account is NOT verified. Please Verifiy your Account before logging in");
              }else{
                console.log("Logged in successfully");
                this.router.navigateByUrl('/dashboard');
              }

          } else{
            this.router.navigateByUrl('/login');
            alert("User does not Exist");
         
            /*this.insertUser();*/
          }
        });
      }
    });
  }

  insertUser() {
    this.authState.subscribe(
      user => {
        const data = {
          email: user.email,
          uid: user.uid,
          display_name: user.displayName,
          username: '',
         
          phone: user.phoneNumber ? user.phoneNumber : null,
          photoURL: user.photoURL ? user.photoURL: '../../assets/images/default_profile_pic.jpg',
          joinDate: firebase.firestore.FieldValue.serverTimestamp(),
          //emailVerified: user.emailVerified
        };

      this.afs.doc('users/' + user.uid ).set(data).then(
        () => {
          this.router.navigateByUrl('/dashboard');
        });
      });
  }

  updatePhotoURL(photourl) {
    const updateRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${this.currentUser.uid}`);
    this.updateData = {
      photoURL : photourl
    };
    return updateRef.update(this.updateData);
  }
  logout() {
    this.afAuth.auth.signOut();
  }

}
