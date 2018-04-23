import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class UserService {
  email;
  name;
  password;
  username;
  description;
  contact;

  constructor(
    private afs: AngularFirestore,
    private router: Router
  ) { }

  getUserDocument(uid) {
    return this.afs.doc<any>('users/' + uid).valueChanges();
  }

  ongoingFeed(uid){
    return this.afs.collection('users/' + uid + '/feed', ref=>ref.where('status','==','ongoing').orderBy('time','desc')).valueChanges();
  }
 finishedFeed(uid){
    return this.afs.collection('users/' + uid + '/feed', ref=>ref.where('status','==','finished').orderBy('time','desc')).valueChanges();
  }
  pendingPolls(uid){
    return this.afs.collection('users/' + uid +'/pending').valueChanges();
  }

  deletePendingPoll(pid, uid){
    this.afs.doc('users/' + uid + '/pending/' + pid).delete().then(()=> console.log('Poll Deleted..'));
  }
  updateUser(uid, name, username, desc){
    this.afs.doc('users/' + uid).update({
      display_name : name,
      username : username,
      desc : desc,
    }).then(()=>{
      console.log('user data updated...');
      this.router.navigateByUrl('/dashboard');
    });
  }
  getMemberGroups(uid){
     return this.afs.collection('users/' + uid + '/memberGroups/').valueChanges();
  } 


}
