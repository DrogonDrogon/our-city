import { Location, Permissions } from 'expo';
import db from '../db';

// Action definitions
const RECEIVE_PHOTOTAGS = 'RECEIVE_PHOTOTAGS';
const IS_POSTING = 'IS_POSTING';
const RECEIVE_LOCATION = 'RECEIVE_LOCATION';

// Action creators

// For fetching all phototags (todo: add fetch by user)
export const fetchPhototags = dispatch => {
  // console.log('[ACTIONS] fetchPhototags fired');
  db.child('phototags').once('value').then(
    snapshot => {
      let data = snapshot.val();
      let phototagArray = [];

      for (var key in data) {
        let obj = {};
        obj = data[key];
        obj.id = key;
        phototagArray.push(obj);
      }
      dispatch(receivePhototags(phototagArray));
    },
    error => {
      console.log('Error fetchPhototags', error);
    }
  );
};

export const receivePhototags = results => {
  // console.log('[ACTIONS] receivePhototags fired');
  return {
    type: RECEIVE_PHOTOTAGS,
    phototags: results,
  };
};

// For posting one phototag
export const postPhototagRequested = phototag => dispatch => {
  let newPostKey = db.child('photoTags').push().key;
  phototag.id = newPostKey;
  db.child('phototags/' + newPostKey).update(phototag).then(() => {
    dispatch(updatePostingStatus(false));
  }, (error) => { console.log('ERROR posting', error) });
};

export const updatePostingStatus = bool => {
  return {
    type: IS_POSTING,
    payload: bool,
  };
};

// For fetching location
export const fetchLocation = dispatch => {};
