import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, fromDocRef } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PollService {


  constructor(private afs:AngularFirestore) { }

  getPoll(){
    return this.afs.collection('polls').valueChanges();
  }

  createPolls()
  {
    
  }
  /*getContenders(){
    return this.afs.coll
  }*/

}
