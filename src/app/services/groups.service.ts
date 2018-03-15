import { Injectable, group } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, fromDocRef } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service'

@Injectable()
export class GroupsService {

  uid;
  constructor(
    private afs:AngularFirestore,
    private auth:AuthService
  ) { }



  getGroups(gid){
    return this.afs.doc('groups/'+ gid).valueChanges();
  }

  createGroup()
  {
    
  }


 /* getGroupInfo(admin){
      this.afs.collection('groups/').valueChanges().subscribe(
        groups=>{
            this.afs.doc(admin).
        }
      );
  
    }*/


}
