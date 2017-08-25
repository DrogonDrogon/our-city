import * as firebase from 'firebase';

// Action definitions
const RECEIVE_PHOTOTAGS = 'RECEIVE_PHOTOTAGS';

// Action creators
export const fetchPhototags = () => {
  console.log('[ACTIONS] fetchPhototags fired', firebase.database());

  // TODO: Figure out why this is not firing the firebase call
  return dispatch => {
    console.log('[ACTIONS] firebase dispatch');
    firebase.database().ref('/phototags/').once('value').then(snapshot => {
      console.log('[ACTIONS] one-time snapshot of users', snapshot);
      dispatch(receivePhototags(snapshot));
    });
  };
};

export const receivePhototags = results => {
  console.log('[ACTIONS] receivePhototags fired');
  return {
    type: RECEIVE_PHOTOTAGS,
    phototags: results,
  };
};
