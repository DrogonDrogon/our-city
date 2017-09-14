import db from '../db';
import { SET_SOLUTIONS } from './constants';

export const fetchSolutionsByUserId = userId => dispatch => {
  console.log('[ACTION] fetchSolutionsByUserId');
  let solutionIds;
  // get all solution ids for one phototag
  db
    .child('users/' + userId + '/solutions')
    .once('value')
    .then(snapshot => {
      let snapshotObj = snapshot.val();
      solutionIds = Object.keys(snapshotObj);
      return solutionIds;
    })
    .then(keys => {
      // get all the solutions (objects) based on the array of solution ids
      const promises = keys.map(id => {
        return db
          .child('solutions/' + id)
          .once('value')
          .then(snapshot => {
            return snapshot.val();
          })
          .catch(err => {
            console.log('err', err);
          });
      });
      Promise.all(promises)
        .then(solutionData => {
          let validEntries = [];
          solutionData.forEach(item => {
            if (item) {
              validEntries.push(item);
            }
          });
          console.log('[ACTION] Received solutions', validEntries);
          dispatch(receiveSolutions(validEntries));
        })
        .catch(err => {
          console.log('[ACTION] Error getting solutions from userId', err);
        });
    });
};

export const receiveSolutions = solutions => {
  return {
    type: SET_SOLUTIONS,
    payload: solutions,
  }
}