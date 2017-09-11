import React from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  Button,
  CameraRoll,
  ImagePicker,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RNS3 } from 'react-native-aws3';
import * as Actions from '../../actions';
import db from '../../db';
import config from '../../config/config';

const awsOptions = {
  keyPrefix: 'phototags/',
  bucket: 'arcity',
  region: 'us-east-1',
  accessKey: config.aws.accessKey,
  secretKey: config.aws.secretKey,
  successActionStatus: 201,
};

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updatePhototag: phototag => {
      dispatch(Actions.updatePhototag(phototag));
    },
    updateUser: userData => {
      dispatch(Actions.updateUser(userData));
    },
  };
};

const generateRandomID = () => {
  return 'xxxxx-xx4xxxy-xxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

class SolverScreen extends React.Component {
  static navigationOptions = {
    title: 'Volunteer a Fix',
  };

  state = {
    phototag: Object.assign({}, this.props.navigation.state.params.phototag),
    description: '',
    modalVisibility: false,
    modalNavTitle: {
      title: 'Edit Description',
    },
    modalNavRightButton: {
      title: 'Save',
      handler: () => {
        this.saveDescription(this.state.editedDescription);
        this.toggleModal(false);
      },
    },
    modalNavLeftButton: {
      title: 'Cancel',
      handler: () => {
        this.toggleModal(false);
      },
    },
    photoUri: this.props.navigation.state.params.phototag.imageUrl,
  };

  _takePic = async () => {
    console.log('click image');
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      base64: true,
      exif: true,
    });

    if (!result.cancelled) {
      CameraRoll.saveToCameraRoll(result.uri);
      this.setState({ photoUri: result.uri });
    }
  };

  handleSaveSolution = () => {
    console.log('click save');
    let isNewPhoto = this.state.photoUri !== this.state.phototag.imageUrl;
    let urlToSave = '';

    if (isNewPhoto) {
      console.log('[handleSave] using the new photo that was taken (not the phototag photo)');
      // Set up file uri to save to AWS
      let photoIdName = generateRandomID();
      let file = {
        uri: this.state.photoUri,
        name: `${photoIdName}.jpg`,
        type: 'image/jpg',
      };

      // Make AWS upload request
      RNS3.put(file, awsOptions).then(response => {
        if (response.status !== 201) {
          console.log('[s3 upload] ERROR failed to upload image', response.body);
          // TODO: handle error through alert
        } else {
          console.log('[s3 upload] Success!');
          let awsUrl = `https://s3.amazonaws.com/${awsOptions.bucket}/${awsOptions.keyPrefix}${photoIdName}.jpg`;
          let newSolution = {
            imageUrl: awsUrl,
            isAccepted: false,
            description: this.state.description,
            userId: this.props.user.id,
            phototagId: this.state.phototag.id,
          };
          this.addSolution(this.props.user.id, newSolution);
        }
      });
    } else {
      console.log('[handleSave] using the old photo (same as phototag)');
      let newSolution = {
        imageUrl: this.state.photoUri,
        isAccepted: false,
        description: this.state.description,
        userId: this.props.user.id,
        phototagId: this.state.phototag.id,
      };
      this.addSolution(this.props.user.id, newSolution);
    }
  };

  addSolution = (userId, solutionData) => {
    // update the solutions node in firebase
    let newSolutionId = db.child('solutions').push().key;
    db
      .child('solutions/' + newSolutionId)
      .update(solutionData)
      .then(() => {
        console.log('New solution posted. Id is', newSolutionId);
        // do something
      })
      .catch(error => console.log('Error writing to solutions', error));

    // update the users node
    let userData = Object.assign({}, this.props.user);
    userData.solutions[newSolutionId] = true;
    this.props.updateUser(userData);

    // update the phototags node
    let photoData = Object.assign({}, this.state.phototag);
    photoData.solutions[newSolutionId] = true;
    this.props.updatePhototag(photoData);
  };

  fetchSolutionsByPhotoId = phototagId => {
    let solutionIds;
    // get all solution ids for one phototag
    db
      .child('phototags/' + phototagId + '/solutions')
      .once('value')
      .then(snapshot => {
        let snapshotObj = snapshot.val();
        console.log('snapshot of phototag solutions', snapshotObj);
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
            console.log('Received all solutions', validEntries);
          })
          .catch(err => {
            console.log('Error getting solutions from photoId', err);
          });
      });
  };

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text>Describe what you will do or have done:</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="i.e. I can move this, I can repair this"
          onChangeText={text => this.setState({ description: text })}
          keyboardType={'default'}
          multiline
        />
        <View>
          <Text>Take an updated image of the site (optional)</Text>
          <Button title="Take new photo" onPress={this._takePic} />
        </View>
        <Image
          onPress={this.handleSelectImage}
          style={{ width: 300, height: 300, resizeMode: Image.resizeMode.contain }}
          source={{ uri: this.state.photoUri }}
        />
        <Button title="Submit" onPress={this.handleSaveSolution} />
      </KeyboardAwareScrollView>
    );
  }
}

const styles = {
  scrollViewContainer: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  titleText: {
    textAlign: 'center',
    fontSize: 20,
    alignItems: 'center',
  },
  imageSetting: {
    width: 200,
    height: 200,
  },
  descriptionInput: {
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    textAlignVertical: 'top',
    fontSize: 16,
    padding: 10,
  },
  center: {
    alignItems: 'center',
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(SolverScreen);
