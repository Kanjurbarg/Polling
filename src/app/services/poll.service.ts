import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, fromDocRef } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Injectable()
export class PollService {


  constructor(private afs:AngularFirestore,private router:Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
  };
 }

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

  addVoter(vid,pid,cid){
    console.log("IN SERVICE "+ vid + " PID "+ pid);
    const data={
      cid:cid,
      time:firebase.firestore.FieldValue.serverTimestamp(),
      uid:vid

    };
    this.afs.doc('polls/'+ pid + '/votes/'+ vid).set(data).then(()=> {
      console.log("Voters Added Succesfully");
      this.router.navigateByUrl('voting/' + pid);
  });
  }

  addVote(voteDetails){
    const vote={
      uid:voteDetails.vid
    };
    this.afs.doc('polls/' + voteDetails.pid + '/contenders/' + voteDetails.cid + '/votes/' + voteDetails.vid).set(vote).then(()=>console.log('vote Added Successfully'));
  }

  contenderStatus(voteDetails){

    console.log("do not interate");
    return this.afs.doc('polls/'+ voteDetails.pid + '/contenders/' + voteDetails.cid).valueChanges();
  }

  voterStatus(pid,uid){
    return this.afs.doc('polls/'+ pid + '/voters/'+ uid).valueChanges();
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
        votes:voteDetails.voteCounter
      }).then(()=> console.log("Voted Incremented Successfully"));
  }

  updateStatus(pid){
    return this.afs.doc('polls/' + pid).update({
      status:"ongoing",
      startedOn:firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  endPoll(pid){
      this.afs.doc('polls/' + pid).update({
        status:"finished"
      });
  }

  /*getContenders(){
    return this.afs.coll
  }*/

}
