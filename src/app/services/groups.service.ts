import { Injectable, group } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, fromDocRef } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router';

@Injectable()
export class GroupsService {

  uid;
  constructor(
    private afs:AngularFirestore,
    private auth:AuthService,
    private router:Router
  ) { }



  getGroups(gid){
    return this.afs.doc('groups/'+ gid).valueChanges();
  }

  createGroup(groupData)
  {
    let adminID;
    this.auth.getAuthState().subscribe(user=>{
      adminID=user.uid;
      const gid=this.afs.createId();
      const data={
        title: groupData.title,
        description: groupData.description,
        gid: gid,
        admin: adminID,
        createdOn: firebase.firestore.FieldValue.serverTimestamp()
  
      }; 
      this.afs.doc('groups/' + gid).set(data).then(()=> this.router.navigateByUrl('groups/' + gid));
    });
  }


 /* getGroupInfo(admin){
      this.afs.collection('groups/').valueChanges().subscribe(
        groups=>{
            this.afs.doc(admin).
        }
      );
  
    }*/


}
