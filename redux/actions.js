import db from '../db/db.js';

// Action definitions
const RECEIVE_PHOTOTAGS = 'RECEIVE_PHOTOTAGS';

// Action creators
export const fetchPhototags = dispatch => {
  console.log('[ACTIONS] fetchPhototags fired');

  db
    .ref('phototags')
    .once('value')
    .then(snapshot => {
      let data = snapshot.val();
      let phototagArray = [];

      for (var key in data) {
        let obj = {};
        obj = data[key];
        obj.id = key;
        phototagArray.push(obj);
      }
      dispatch(receivePhototags(phototagArray));
    })
    .catch(error => console.log('Error fetchPhototags', error));
};

export const receivePhototags = results => {
  console.log('[ACTIONS] receivePhototags fired');
  return {
    type: RECEIVE_PHOTOTAGS,
    phototags: results,
  };
};
