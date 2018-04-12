import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { event } from 'firebase-functions/lib/providers/analytics';

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

