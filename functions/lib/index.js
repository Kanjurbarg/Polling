"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const afs = admin.firestore();
exports.onVote = functions.firestore
    .document('polls/{pid}/votes/{vid}')
    .onCreate(event => {
    const pid = event.params.pid;
    const uid = event.params.vid;
    const voteDoc = event.data.data();
    const cid = voteDoc.cid;
    const data = {
        uid: uid
    };
    afs.doc('polls/' + pid + '/contenders/' + cid + '/votes/' + uid).set(data).catch(err => console.log(err));
    afs.collection('polls/' + pid + '/contenders/' + cid + '/votes/').get().then(votes => {
        const voteCount = votes.size;
        afs.doc('polls/' + pid + '/contenders/' + cid).update({
            votes: voteCount
        });
    }).catch(err => console.log(err));
});
//# sourceMappingURL=index.js.map