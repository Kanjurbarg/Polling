import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getUserDocument(uid) {
    return this.afs.doc<any>('users/' + uid).valueChanges();
  }

}
