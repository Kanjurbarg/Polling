import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firestore } from 'firebase';
import { Title } from '@angular/platform-browser';

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
    private router: Router,
   
  ) { }

  getUserDocument(uid) {
    return this.afs.doc<any>('users/' + uid).valueChanges();
  }

  updateFeed(uid , pid){
    this.afs.doc('users/' + uid + '/feed/' + pid).update({
      status: 'finished'
    });
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
  updateUser(userData){
    this.afs.doc('users/' + userData.uid).update({
      display_name : userData.display_name,
      username : userData.username,
      
    }).then(()=>{
      console.log('user data updated...');
      this.router.navigateByUrl('/dashboard');
    });
  }
  getMemberGroups(uid){
     return this.afs.collection('users/' + uid + '/memberGroups/').valueChanges();
  } 

  feedback(feedback){
    const id = this.afs.createId();
    const data={
      subject : feedback.subject,
      body : feedback.body,
      uid: feedback.uid,
      id : id
    };
    this.afs.doc('users/' + feedback.uid + '/feedback/' + id).set(data).then(()=>{
      console.log('Feedback sent sucessfully...');
      this.router.navigateByUrl('/dashboard');
      alert('Feedback Submitted Sucessfully');
    });
  }

}
