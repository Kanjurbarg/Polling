import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, fromDocRef } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class PollService {
uid;

  constructor(
    private afs:AngularFirestore,
    private router:Router,
    private auth:AuthService
      ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
  };
  this.auth.getAuthState().subscribe(user=>{
    this.uid=user.uid;
  });
 }

  getPoll(pid){
    return this.afs.doc('polls/' + pid).valueChanges();
  }
    
  goToChoice(){
    let go='success';
    let obs:Observable<any>
    return go;
  }  

  createPolls(pollDetails)
  {
    if(pollDetails.type === 'election')
    {
      const pid =this.afs.createId();
      const data={
      title:pollDetails.title,
      des:pollDetails.des,
      gid:pollDetails.gid,
      status:"off",
      type:pollDetails.type,
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


  if(pollDetails.type === 'opinion'){
    const pid =this.afs.createId();
    const data={
    title:pollDetails.title,
    des:pollDetails.des,
    gid:pollDetails.gid,
    status:"off",
    type:pollDetails.type,
    pid:pid,
    createdOn:firebase.firestore.FieldValue.serverTimestamp(),
  };
  this.afs.doc('polls/'+pid).set(data)
    .then(()=>{
      console.log("Success");
      this.router.navigateByUrl('poll/'+pid);
    }).catch((err)=>{
      console.log(err);
    });
  }

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

  addVoter(pid,cid){

    const data={
      cid:cid,
      time:firebase.firestore.FieldValue.serverTimestamp(),
      uid:this.uid

    };
    this.afs.doc('polls/'+ pid + '/votes/'+ this.uid).set(data).then(()=> {
      console.log("Voters Added Succesfully");
      this.router.navigateByUrl('voting/' + pid);
  });
  }

  addVote(voteDetails){
    const vote={
      uid:this.uid
    };
    this.afs.doc('polls/' + voteDetails.pid + '/contenders/' + voteDetails.cid + '/votes/' + this.uid).set(vote).then(()=>console.log('vote Added Successfully'));
  }


  getChoices(pid){
    return this.afs.collection('polls/' + pid + '/choices').valueChanges();
  }
  addChoice(voteData){
   let cid = this.afs.createId();
    const data={
      choiceId: cid,
      choice: voteData.choice,
      votes: voteData.votes,

    }
    this.afs.doc('polls/' + voteData.pid + '/choices/' + cid).set(data)
    .then(()=>{console.log("Choice Added Successfully")}).catch((err)=> console.log(err));
  }

  contenderStatus(voteDetails){

    console.log("do not interate");
    return this.afs.doc('polls/'+ voteDetails.pid + '/contenders/' + voteDetails.cid).valueChanges();
  }

  voterStatus(pid,uid){

    return this.afs.doc('polls/'+ pid + '/votes/'+ uid).valueChanges();
  }

  getGroupPolls(gid){
    console.log("GID "+ gid);
    return this.afs.collection('polls',ref=>ref.where('gid','==',gid)).valueChanges();
  }

  getContenders(pid){
    return this.afs.collection('polls/'+ pid + '/contenders/').valueChanges();
  }
  displayVoters(pid){
    return this.afs.collection('polls/' + pid +'/votes/').valueChanges();
  }

 /* registerVote(voteDetails){
       this.afs.doc('polls/'+ voteDetails.pid + '/contenders/' + voteDetails.cid).update({
        votes:voteDetails.voteCounter
      }).then(()=> console.log("Voted Incremented Successfully"));
  }*/

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


  displayResult(pid){
    return this.afs.collection('polls/'+ pid +'/contenders/',ref=>ref.orderBy('votes', 'desc')).valueChanges();

  }

  /*getContenders(){
    return this.afs.coll
  }*/

}
