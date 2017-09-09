//retrive based on tag
// fetch a list of Mary's groups
export const fetchFilteredPhotoTags = (user, favs = 0, radius, numResults, tags = [])=> dispatch => {
  //need to use tags to retrieve photos ref.child("tags/")
  let output = [];
  //should iterate over the tags section doing a request for each tag
  //then take a subset of the tags that match all tags
  	tags.forEach()
  		db.child(`/tags/${tags[i]}`).on('child_added', function(snapshot) {
		    // for each photo, grab the photo and push to array. problems with asycnchronicity
		    let photoKey = snapshot.key();
		    ref.child("phototags/" + photoKey).once('value', function(snapshot) {
           if(!output.includes(snapshot.val())){output.push(snapshot.val())};
		    });
		  })

  //should then run it through radius
  //should then run it through favorites if selected
  //should then limit to numResults

  // db.child("users/").on('child_added', function(snapshot) {
  //   // for each group, fetch the name and print it
  //   String groupKey = snapshot.key();
  //   ref.child("groups/" + groupKey + "/name").once('value', function(snapshot) {
  //     System.out.println("Mary is a member of this group: " + snapshot.val());
  //   });
  // })
}




// call a property and use the results to call another property
export const fetchList = (path)=> dispatch =>{

	ref.child(path).on('child_added', function(snapshot) {
	  // for each group, fetch the name and print it
	  String pathKey = snapshot.key();
	  ref.child("groups/" + groupKey + "/name").once('value', function(snapshot) {
	    System.out.println("Mary is a member of this group: " + snapshot.val());
	  });

	})

}

export const fetchFavoritesByUser = userInfo => dispatch => {
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
    })
    .catch(err => {
      console.log('ERR getting userFavs', err);
    });
};