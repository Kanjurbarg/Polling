
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';


admin.initializeApp(functions.config().firebase);
const afs = admin.firestore();

exports.onVote = functions.firestore
    .document('polls/{pid}/votes/{vid}')
    .onCreate(event => {
        const pid = event.params.pid;
        const uid = event.params.vid;

        const voteDoc = event.data.data();
        const cid = voteDoc.cid;
        
        const data={
            uid:uid
        };
        afs.doc('polls/' + pid + '/contenders/' + cid + '/votes/' + uid).set(data).catch(err=> console.log(err));

        afs.collection('polls/' + pid + '/contenders/' + cid + '/votes/').get().then(votes=>{
            const voteCount = votes.size;

            afs.doc('polls/' + pid + '/contenders/' + cid).update({
                votes:voteCount
            });    
        }).catch(err=> console.log(err));
    });



    exports.onOpinionVote = functions.firestore
    .document('polls/{pid}/opinions/{vid}')
    .onCreate(event => {
       
        const pid = event.params.pid;
        const uid = event.params.vid;

        const voteDoc = event.data.data();
        const cid = voteDoc.cid;
       
        const data={
            uid:uid
        };
        afs.doc('polls/' + pid + '/choices/' + cid + '/votes/' + uid).set(data)
        .then(()=>{
            afs.collection('polls/' + pid + '/choices/' + cid + '/votes/').get().then(votes=>{
           
                const voteCount = votes.size;
              
                afs.doc('polls/' + pid + '/choices/' + cid).update({
                    votes:voteCount
                }).catch((err)=> console.log(err));    
                
             
            }).catch(err=> {console.log(err);});
        })
        .catch(err=> console.log(err));
        
     
    });


   




