import { Injectable, group } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, fromDocRef } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router';
import { groupDetails } from '../models/groups.model'


@Injectable()
export class GroupsService {

  uid;
  //group
  members=[];
  //Admin Groups
  groupCol:AngularFirestoreCollection<any>;
  groupsObs:Observable<any>;
  groupDoc:AngularFirestoreDocument<any>;
  constructor(
    private afs:AngularFirestore,
    private auth:AuthService,
    private router:Router
  ) { }



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

  getMyGroups(adminID){
    console.log('this is admin ID  '+adminID);
    this.groupCol = this.afs.collection('groups', ref=>ref.where('admin','==',adminID));
    this.groupsObs = this.groupCol.valueChanges();
    console.log(this.groupsObs);
    return this.groupsObs;
  }

  getGroups(gid){
    return this.afs.doc<any>('groups/' + gid).valueChanges();
         
  }

  getMembers(gid){
    return this.afs.collection('groups/' + gid + '/members/').valueChanges();
  }
  displayMembers(gid){
   return  this.afs.doc<any>('groups/'+ gid).valueChanges();
  
  }

}
