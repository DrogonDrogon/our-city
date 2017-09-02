import firebase from 'firebase';
import db from '../db';
import { SET_USER, IS_LOGGED_IN } from './constants';

// For checking if user is logged in
export const checkUserLogin = () => dispatch => {
  firebase.auth().onAuthStateChanged(user => {
    if (user != null) {
      console.log('We are authenticated now! User is', user.uid);
      // check if new user
      dispatch(getUserByIdBegin(user));
    } else {
      dispatch(checkUserLoginComplete(false));
    }
  });
};

export const updateUser = user => dispatch => {
  console.log('[ACTIONS] updateUser is firing with user', user);
  db
    .child('users/' + user.id)
    .update(user)
    .then(() => {
      dispatch(getUserInfoCompleted(user));
    })
    .catch(error => {
      console.log('ERROR posting updating user', error);
    });
};

export const updatePhototagsUnderUserId = (userId, phototagIdData) => dispatch => {
  db
    .child('users/' + userId + '/phototags/')
    .update(phototagIdData)
    .then(() => {
      dispatch(queryUsersById(userId));
    })
    .catch(error => console.log('ERROR writing to /users', error));
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

export const queryUsersById = userId => dispatch => {
  db
    .child('users/' + userId)
    .once('value')
    .then(snapshot => {
      let userData = snapshot.val();
      if (userData) {
        // if the data exists, then we return the data
        dispatch(getUserInfoCompleted(userData));
      } else {
        console.log('ERROR getting user by id:', userId);
        // handle if user not found
      }
    });
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

export const checkUserLoginComplete = bool => {
  return {
    type: IS_LOGGED_IN,
    payload: bool,
  };
};
