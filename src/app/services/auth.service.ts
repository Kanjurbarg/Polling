import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
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
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(() => this.checkUser());
    });
  }

  googleLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(() => this.checkUser())
    .catch(err => console.log(err));
  }

  checkUser() {
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

  insertUser() {
    this.authState.subscribe(
      user => {
        const data = {
          email: user.email,
          uid: user.uid,
          name: user.displayName,
          username: null,
          desc: 'Vote for me!',
          joinDate: firebase.firestore.FieldValue.serverTimestamp()
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
