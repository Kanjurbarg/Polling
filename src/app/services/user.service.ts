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

 /* addUser( email,
    name,
    password,
    username,
    description,
    contact,){
      this.name=name;
      this.email=email;
      this.password=password;

    this.afs.collection('users').add(user);
  };*/

}
