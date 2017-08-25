import * as firebase from 'firebase';

// Action definitions
const SET_PHOTOTAGS = 'SET_PHOTOTAGS';

// Action creators
export const fetchPhototags = () => {
  console.log('fetch photo tags');
  return dispatch => {
    return firebase.database().ref('/phototags/').once('value').then(snapshot => {
      console.log('one-time snapshot of users', snapshot);
      dispatch(receivePhototags(snapshot));
    });
  };
};

export const receivePhototags = (results) => {
  console.log('receive photo tags');
  return {
    type: SET_PHOTOTAGS,
    payload: results,
  };
};