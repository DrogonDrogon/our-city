import db from '../db';
import { RECEIVE_PHOTOTAGS, IS_LOADING } from './constants';
import * as Actions from './userActions';

// TODO: For fetching all phototags for ONE user

// For fetching all phototags (ALL users)
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
      dispatch(updateLoadingStatus(false));
    })
    .catch(error => console.log('ERROR fetch', error));
};

// For posting one phototag
export const postPhototagRequested = phototag => dispatch => {
  let postKey;
  if (!phototag.id) {
    postKey = db.child('photoTags').push().key;
    phototag.id = postKey;
  } else {
    postKey = phototag.id;
  }

  // let userToUpdate = {};
  // userToUpdate.id = phototag.userId;
  // userToUpdate['phototags'][`${phototag.id}`] = true;
  // console.log('user TO update', userToUpdate);
  // dispatch(Actions.updateUser(userToUpdate));

  var phototagRecord = {};
  var key = phototag.id;
  phototagRecord[key] = true;

  dispatch(Actions.updatePhototagsUnderUserId(phototag.userId, phototagRecord));

  db
    .child('phototags/' + postKey)
    .update(phototag)
    .then(() => {
      // Fire another fetch to get all updated phototags
      dispatch(fetchPhototags);
      dispatch(updateLoadingStatus(false));
    })
    .catch(error => console.log('ERROR writing to /posts', error));

  

//   db
//     .child('users/' + phototag.userId + '/phototags/')
//     .update({ postKey: true })
//     .then(() => {
//       dispatch()
//     })
//     .catch(error => console.log('ERROR writing to /users', error));
};

// For updating posting/loading status
export const updateLoadingStatus = bool => {
  return {
    type: IS_LOADING,
    payload: bool,
  };
};

export const receivePhototags = results => {
  // console.log('[ACTIONS] receivePhototags fired');
  return {
    type: RECEIVE_PHOTOTAGS,
    phototags: results,
  };
};
