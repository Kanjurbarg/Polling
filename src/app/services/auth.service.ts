import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, fromDocRef } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  private authState: Observable<firebase.User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.authState = this.afAuth.authState;
  }

  getAuthState() {
    return this.authState;
  }

  emailLogin(email, password) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then(() => this.checkUser())
    .catch(() => {
      /*this.afAuth.auth.createUserWithEmailAndPassword(email, password)
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
        alert('success');
        this.getAuthState().subscribe(user=>{
          if(user){
            console.log(user);
            const data={  
              email: userData.email,
              uid: user.uid,
              name: userData.name,
              username: userData.username,
              desc: userData.description,
              phone: userData.contact ? userData.contact : null,
              photoURL: user.photoURL ? user.photoURL:null,
              joinDate: firebase.firestore.FieldValue.serverTimestamp(),
              //emailVerified: user.emailVerified
            };
            this.afs.doc('users/'+ user.uid).set(data).then(()=>{
              this.router.navigateByUrl('/dashboard');
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
      const uid = user.uid;
      this.afs.doc('users/' + uid).valueChanges().subscribe(
        userDoc => {
          if (userDoc) {
            this.router.navigateByUrl('/dashboard');
            
          } else {
           /* alert("User Alredy Exist");*/
            /*this.insertUser();*/
          }
        });
    });
  }

  insertUser() {
    this.authState.subscribe(
      user => {
        const data = {
          email: user.email,
          uid: user.uid,
          name: user.displayName,
          username: '',
          desc: 'Vote for me!',
          phone: user.phoneNumber ? user.phoneNumber : null,
          photoURL: user.photoURL,
          joinDate: firebase.firestore.FieldValue.serverTimestamp(),
          emailVerified: user.emailVerified
        };

      this.afs.doc('users/' + user.uid ).set(data).then(
        () => {
          this.router.navigateByUrl('/dashboard');
        });
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

}
