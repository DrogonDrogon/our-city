//retrive based on tag
// fetch a list of Mary's groups
export const fetchFilteredPhotoTags = (user, favs = 0, radius, numResults, tags = [])=> dispatch => {
  //need to use tags to retrieve photos ref.child("tags/")
  //should iterate over the tags section doing a request for each tag
  //then take a subset of the tags that match all tags
  	for (var i = 0; i < tags.length; i++) {
  		db.child(`/tags/${tags[i]}`).on('child_added', function(snapshot) {
		    // for each group, fetch the name and print it
		    String photoKey = snapshot.key();
		    ref.child("phototags/" + photoKey).once('value', function(snapshot) {
		      System.out.println("Mary is a member of this group: " + snapshot.val());
		    });
		  })
  	}
  //should then run it through radius
  //should then run it through favorites if selected
  //should then limit to numResults

  db.child("users/").on('child_added', function(snapshot) {
    // for each group, fetch the name and print it
    String groupKey = snapshot.key();
    ref.child("groups/" + groupKey + "/name").once('value', function(snapshot) {
      System.out.println("Mary is a member of this group: " + snapshot.val());
    });
  })
}

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