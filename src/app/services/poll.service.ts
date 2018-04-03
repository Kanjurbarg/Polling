import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, fromDocRef } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Injectable()
export class PollService {


  constructor(private afs:AngularFirestore,private router:Router) { }

  getPoll(pid){
    return this.afs.doc('polls/' + pid).valueChanges();
  }

  createPolls(pollDetails)
  {
    const pid =this.afs.createId();
    const data={
      title:pollDetails.title,
      des:pollDetails.des,
      gid:pollDetails.gid,
      status:"off",
      pid:pid,
      createdOn:firebase.firestore.FieldValue.serverTimestamp(),
      duration:pollDetails.duration,
    };
    this.afs.doc('polls/'+pid).set(data)
    .then(()=>{
      console.log("Success");
      this.router.navigateByUrl('poll/'+pid);
    }).catch((err)=>{
      console.log(err);
    });
  }


  addContenders(contender){
    console.log("Service pid"+ contender.pid)
    const data={
      cid:contender.cid,
      votes:contender.votes
    };
    this.afs.doc('polls/'+ contender.pid +'/contenders/'+data.cid).set(data).then(()=>{
      console.log("Contender add successfully..");
    });
  }

  addVoters(vid,pid){
    console.log("IN SERVICE "+ vid + " PID "+ pid);
    const data={
      vid:vid,
      voted:"no",
    };
    this.afs.doc('polls/'+ pid + '/voters/'+ vid).set(data).then(()=> {
      console.log("Voters Added Succesfully");
      this.router.navigateByUrl('voting/'+pid);
  });
  }

  getGroupPolls(gid){
    console.log("GID "+ gid);
    return this.afs.collection('polls',ref=>ref.where('gid','==',gid)).valueChanges();
  }

  getContenders(pid){
    return this.afs.collection('polls/'+ pid + '/contenders/').valueChanges();
  }
  displayVoters(pid){
    return this.afs.collection('polls/' + pid +'/voters/').valueChanges();
  }

  registerVote(voteDetails){
      this.afs.doc('polls/'+ voteDetails.pid + '/contenders/' + voteDetails.cid).update({
        votes:+1,
      });
  }
  updateStatus(pid){
    return this.afs.doc('polls/' + pid).update({
      status:"ongoing",
      startedOn:firebase.firestore.FieldValue.serverTimestamp(),
    });
  }
  /*getContenders(){
    return this.afs.coll
  }*/

}
