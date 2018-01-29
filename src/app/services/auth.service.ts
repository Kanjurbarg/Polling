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

  googleLogin() {
    const google = new firebase.auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(google)
    .then(
      () => {
        this.router.navigateByUrl('/dashboard');
      })
    .catch(
      err => {
        alert(err);
        console.log(err);
      });
  }
  logout() {
    this.afAuth.auth.signOut();
  }

}
