import { Location, Permissions } from 'expo';
import firebase from 'firebase';
import db from '../db';

// Action definitions
const RECEIVE_PHOTOTAGS = 'RECEIVE_PHOTOTAGS';
const IS_POSTING = 'IS_POSTING';
const SET_USER = 'SET_USER';
const SET_TAG_FROM_MAP = 'SET_TAG_FROM_MAP';
const SET_TAG_FROM_USER = 'SET_TAG_FROM_USER';
const IS_LOGGED_IN = 'IS_LOGGED_IN';

// Action creators

// For checking if user is logged in
export const checkUserLogin = () => dispatch => {
  firebase.auth().onAuthStateChanged(user => {
    if (user != null) {
      console.log('We are authenticated now! User is', user);
      // Set up user info to save
      let userInfo = {};
      userInfo.id = user.uid;

      // If auth through fb, can save displayName and photoUrl
      if (user.providerData[0].providerId === 'facebook.com') {
        userInfo.authMethod = 'facebook';
        userInfo.photoUrl = user.photoURL;
        userInfo.displayName = user.displayName;
      }
      dispatch(postNewUserBegin(userInfo));
      dispatch(checkUserLoginComplete(true));
    } else {
      dispatch(checkUserLoginComplete(false));
    }
  });
};

export const checkUserLoginComplete = bool => {
  return {
    type: IS_LOGGED_IN,
    payload: bool,
  };
};

// For fetching all phototags (todo: add fetch by user)
export const fetchPhototags = dispatch => {
  // console.log('[ACTIONS] fetchPhototags fired');
  db
    .child('phototags')
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
    .catch(error => console.log('ERROR fetch', error));
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
  db
    .child('phototags/' + newPostKey)
    .update(phototag)
    .then(() => {
      dispatch(updatePostingStatus(false));
    })
    .catch(error => console.log('ERROR post', error));
};

export const updatePostingStatus = bool => {
  return {
    type: IS_POSTING,
    payload: bool,
  };
};

// For posting new user
export const postNewUserBegin = userInfo => dispatch => {
  db
    .child('users/' + userInfo.id)
    .update(userInfo)
    .then(() => {
      dispatch(postNewUserCompleted(userInfo));
    })
    .catch(error => {
      console.log('ERROR posting new user', error);
    });
};

export const postNewUserCompleted = userInfo => {
  return {
    type: SET_USER,
    payload: userInfo,
  };
};

export const selectedPhototagMap = phototag => {
  return {
    type: SET_TAG_FROM_MAP,
    payload: phototag,
  };
};

export const selectedPhototagUser = phototag => {
  return {
    type: SET_TAG_FROM_USER,
    payload: phototag,
  };
};
