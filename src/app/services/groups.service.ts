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
      this.afs.doc('groups/' + gid).set(data)
      .then(()=> {
        this.router.navigateByUrl('groups/' + gid);
        const data= {
          memberID:adminID,
          addedOn:firebase.firestore.FieldValue.serverTimestamp()
        };
        this.afs.doc('groups/' + gid + '/members/' + adminID).set(data);
      });
    });
  }

  getMyGroups(adminID){
    console.log('this is admin ID  '+adminID);
    this.groupCol = this.afs.collection('groups', ref=>ref.where('admin','==',adminID));
    this.groupsObs = this.groupCol.valueChanges();
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

  addMember(gid, uid){

  }

  getOpinionPolls(pid){
   
    return this.afs.collection('polls/' , ref=>ref.where('type','==','opinion').orderBy('time', 'desc')).valueChanges();
  }
  getElectionPolls(pid){
    return this.afs.collection('polls/' , ref=>ref.where('type','==','election').orderBy('time', 'desc')).valueChanges();
  }
  getGroupPolls(gid){
      console.log(gid);
      return this.afs.collection('groups/' + gid + '/groupPolls').valueChanges();
  }

  

}
