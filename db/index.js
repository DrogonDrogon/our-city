import * as firebase from 'firebase';
import config from '../config/config.js';

const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  databaseURL: config.firebase.databaseURL,
  storageBucket: config.firebase.storageBucket,
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database().ref();

database.deleteComment = (commentId, userId, phototagId, callback) => {
  // delete comment from [/comments]
  database
    .child(`comments/${commentId}`)
    .remove()
    .then(() => {
      // delete comment from [phototags/id/comments]
      database
        .child(`phototags/${phototagId}/comments/${commentId}`)
        .remove()
        .then(() => {
          // delete comment from [users/id/comments]
          database
            .child(`users/${userId}/comments/${commentId}`)
            .remove()
            .then(() => {
              let success = `${commentId} deleted`;
              callback(null, success);
            })
            .catch(err => {
              callback(err, null);
            });
        })
        .catch(err => {
          callback(err, null);
        });
    })
    .catch(err => {
      callback(err, null);
    });
};

export default database;
