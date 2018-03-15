import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class ElectionService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getContenders(eid) {
    return this.afs.collection('polls/' + eid + '/contenders').valueChanges();
  }

  getElection(eid) {
    return this.afs.doc<any>('elections/' + eid).valueChanges();
  }

  getPendingPoll(){

  }


}
