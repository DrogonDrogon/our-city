import { Location, Permissions } from 'expo';
import firebase from 'firebase';
import db from '../db';

// ACTION DEFINITIONS
// Phototag related actions
const RECEIVE_PHOTOTAGS = 'RECEIVE_PHOTOTAGS';
const IS_POSTING = 'IS_POSTING';

// User related actions
const SET_USER = 'SET_USER';
const IS_LOGGED_IN = 'IS_LOGGED_IN';

// Other actions
const SET_TAG_FROM_MAP = 'SET_TAG_FROM_MAP';
const SET_TAG_FROM_USER = 'SET_TAG_FROM_USER';

// ACTION CREATORS
// For checking if user is logged in
export const checkUserLogin = () => dispatch => {
  firebase.auth().onAuthStateChanged(user => {
    if (user != null) {
      console.log('We are authenticated now! User is', user);
      // check if new user
      dispatch(getUserByIdBegin(user));
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

// For posting new user
export const postNewUserBegin = user => dispatch => {
  // Set up user info to save
  let userInfo = {};
  userInfo.id = user.uid;
  userInfo.votes = { phototagId: true };
  userInfo.phototags = { phototagId: true };
  userInfo.favs = { phototagId: true };
  userInfo.comments = { commentId: true };
  userInfo.timestamp = new Date();

  // If auth through email/password, save info
  if (user.providerData[0].providerId === 'password') {
    userInfo.authMethod = 'email-password';
    userInfo.email = user.email;
    userInfo.photoUrl =
      'https://upload.wikimedia.org/wikipedia/commons/4/41/NYC_Skyline_Silhouette.png';
    userInfo.displayName = '';
  }

  // If auth through fb, can save displayName and photoUrl
  if (user.providerData[0].providerId === 'facebook.com') {
    userInfo.authMethod = 'facebook';
    userInfo.email = user.providerData[0].email;
    userInfo.photoUrl = user.photoURL;
    userInfo.displayName = user.displayName;
  }

  db
    .child('users/' + userInfo.id)
    .update(userInfo)
    .then(() => {
      dispatch(getUserInfoCompleted(userInfo));
      dispatch(checkUserLoginComplete(true));
    })
    .catch(error => {
      console.log('ERROR posting new user', error);
    });
};

export const getUserInfoCompleted = userInfo => {
  return {
    type: SET_USER,
    payload: userInfo,
  };
};

// For fetching user by userId
export const getUserByIdBegin = user => dispatch => {
  db
    .child('users/' + user.uid)
    .once('value')
    .then(snapshot => {
      let userData = snapshot.val();
      if (userData) {
        // if the data exists, then we return the data
        dispatch(getUserInfoCompleted(userData));
        dispatch(checkUserLoginComplete(true));
      } else {
        // if the data doesn't exist, we create a new user to save
        dispatch(postNewUserBegin(user));
      }
    });
};

// export const signupNewUserByEmail = (userName) => dispatch => {

// }

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
  let newPostKey;
  if (!phototag.id) {
    newPostKey = db.child('photoTags').push().key;
    phototag.id = newPostKey;
  } else {
    newPostKey = phototag.id;
  }

  db
    .child('phototags/' + newPostKey)
    .update(phototag)
    .then(() => {
      dispatch(updatePostingStatus(false));
      // Fire another fetch to get all updated phototags
      dispatch(fetchPhototags);
    })
    .catch(error => console.log('ERROR post', error));
};

export const updatePostingStatus = bool => {
  return {
    type: IS_POSTING,
    payload: bool,
  };
};

// For selecting photo
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
