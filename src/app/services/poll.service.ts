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
    })
  }

  getGroupPolls(gid){

  }
  /*getContenders(){
    return this.afs.coll
  }*/

}
