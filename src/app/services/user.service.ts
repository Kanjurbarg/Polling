import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
  email;
  name;
  password;
  username;
  description;
  contact;

  constructor(
    private afs: AngularFirestore
  ) { }

  getUserDocument(uid) {
    return this.afs.doc<any>('users/' + uid).valueChanges();
  }

  opinionFeed(uid){
    return this.afs.collection('users/' + uid + '/feed/', ref=>ref.where('status','==','ongoing')).valueChanges();
  }

}
