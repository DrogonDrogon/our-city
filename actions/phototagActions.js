import db from '../db';
import { RECEIVE_PHOTOTAGS, IS_LOADING } from './constants';
import * as Actions from './userActions';

// For fetching all phototags (ALL users)
export const fetchPhototags = dispatch => {
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
};

// For fetching a user's favorites
export const fetchFavoritesByUserId = userId => dispatch => {
  
}

// For fetching a user's phototags
export const fetchPhototagsByUserId = userId => dispatch => {
  
}

export const updateLoadingStatus = bool => {
  return {
    type: IS_LOADING,
    payload: bool,
  };
};

export const receivePhototags = results => {
  return {
    type: RECEIVE_PHOTOTAGS,
    phototags: results,
  };
};
