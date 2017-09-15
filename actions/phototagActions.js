import db from '../db';
import { RECEIVE_PHOTOTAGS, IS_LOADING, RECEIVE_FAVS } from './constants';
import * as Actions from './userActions';
import { store } from '../navigators/AppRoot.js';

export const listenForPhototags = dispatch => {
  db.child('phototags').on('value', snapshot => {
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
  });
};

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
      let userid = store.getState().user.id;
      let badges = 0;
      phototagArray.forEach(tag => {
        if (userid === tag.userId) {
          badges += tag.badges;
        }
      });
      phototagArray = phototagArray.sort((a, b) => {
        return b.badges - a.badges;
      });

      dispatch(Actions.setBadge(badges));
      dispatch(receivePhototags(phototagArray));
      dispatch(updateLoadingStatus(false));
    })
    .catch(error => console.log('ERROR fetch', error));
};

// For posting one phototag that the LOGGED IN USER owns
export const postNewPhototag = phototag => dispatch => {
  let postKey = db.child('photoTags').push().key;

  // Saves phototag ID under users/userId/phototags
  let phototagRecord = {};
  phototagRecord[postKey] = true;
  dispatch(Actions.updatePhototagsUnderUserId(phototag.userId, phototagRecord));

  db
    .child('phototags/' + postKey)
    .update(phototag)
    .then(() => {
      // Fire another fetch to get all updated phototags
      // dispatch(fetchPhototags);
      dispatch(updateLoadingStatus(false));
    })
    .catch(error => console.log('ERROR writing to /posts', error));
};

// For updating an existing phototag
export const updatePhototag = phototag => dispatch => {
  let postKey = phototag.id;
  db
    .child('phototags/' + postKey)
    .update(phototag)
    .then(() => {
      // Fire another fetch to get all updated phototags
      // dispatch(fetchPhototags);
      dispatch(updateLoadingStatus(false));
    })
    .catch(error => console.log('ERROR writing to /posts', error));
};

// For adding a new comment under 'comments' node
export const addCommentUnderPhototag = (phototagId, commentData, badgeCount) => dispatch => {
  db
    .child('phototags/' + phototagId + '/comments/')
    .update(commentData)
    .then(() => {
      // dispatch(fetchPhototags);
      db
        .child('phototags/' + phototagId)
        .update({ badges: badgeCount })
        .then(() => {
          console.log('Update comment done');
        })
    })
    .catch(error => console.log('ERROR writing to /phototags/comments', error));
};

// For fetching favorite-phototags by userObject
export const fetchFavoritesByUser = userInfo => dispatch => {
  dispatch(updateLoadingStatus(true));
  // fetch favorites
  let favKeys = Object.keys(userInfo.favs);
  const favPromises = favKeys.map(id => {
    return db
      .child('phototags')
      .child(id)
      .once('value')
      .then(snapshot => {
        return snapshot.val();
      })
      .catch(err => {
        console.log('err', err);
      });
  });
  // return an array of phototags (userFavs)
  Promise.all(favPromises)
    .then(userFavs => {
      // check to filter out placeholders
      let validEntries = [];
      userFavs.forEach(item => {
        if (item) {
          validEntries.push(item);
        }
      });
      dispatch(receiveFavoritesByUser(validEntries));
      dispatch(updateLoadingStatus(false));
    })
    .catch(err => {
      console.log('ERR getting userFavs', err);
    });
};

export const receiveFavoritesByUser = favs => {
  return {
    type: RECEIVE_FAVS,
    payload: favs,
  };
};

// For fetching all-phototags by userId
export const fetchPhototagsByUserId = userId => dispatch => {};

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
