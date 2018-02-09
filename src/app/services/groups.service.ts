import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, fromDocRef } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class GroupsService {

  constructor(
    private afs:AngularFirestore
  ) { }

  getGroups(gid){
    return this.afs.doc('groups/'+ gid).valueChanges();
  }
}
