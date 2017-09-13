import db from '../db';
import { SET_COMMENTS } from './constants';

export const getAllCommentsByUser = user => dispatch => {
  let commentKeys = Object.keys(user.comments);
  // Use comment Id to query comments,
  const commentPromises = commentKeys.map(id => {
    return db
      .child('comments/' + id)
      .once('value')
      .then(snapshot => {
        return snapshot.val();
      })
      .catch(err => {
        console.log('Err fetching comments', err);
      });
  });
  Promise.all(commentPromises)
    .then(comments => {
      return comments;
    })
    // Then get the phototagData from comment.phototagId
    .then(comments => {
      let validComments = comments.filter(item => {
        return item !== null && item !== undefined;
      });

      const photoPromises = validComments.map(comment => {
        return db
          .child('phototags/' + comment.phototagId)
          .once('value')
          .then(snapshot => {
            comment.phototagData = snapshot.val();
            return comment;
          });
      });
      Promise.all(photoPromises).then(commentsWithPhototagData => {
        dispatch(getAllCommentsByUserComplete(commentsWithPhototagData));
      });
    })
    .catch(err => {
      console.log('Err getting phototags', err);
      this.props.updateLoadingStatus(false);
    });
};

export const deleteComment = (commentId, userData, phototagId) => dispatch => {
  // delete comment from [/comments]
  db
    .child(`comments/${commentId}`)
    .remove()
    .then(() => {
      // delete comment from [phototags/id/comments]
      return db
        .child(`phototags/${phototagId}/comments/${commentId}`)
        .remove()
        .then(() => {
          // delete comment from [users/id/comments]
          return db
            .child(`users/${userData.id}/comments/${commentId}`)
            .remove()
            .then(() => {
              console.log(`[success fully deleted commentId] -> ${commentId}`);
              dispatch(getAllCommentsByUser(userData));
            })
            .catch(err => {
              console.log('[del comment] err', err);
            });
        })
        .catch(err => {
          console.log('[del comment] err', err);
        });
    })
    .catch(err => {
      console.log('[del comment] err', err);
    });
};

export const getAllCommentsByUserComplete = comments => {
  return {
    type: SET_COMMENTS,
    payload: comments,
  };
};
