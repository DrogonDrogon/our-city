import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Image, Text, TextInput, CameraRoll, Alert } from 'react-native';
import { ImagePicker } from 'expo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RNS3 } from 'react-native-aws3';
import Button from '../../components/Button';
import * as Actions from '../../actions';
import db from '../../db';
import config from '../../config/config';
import AppStyles from '../../styles/AppStyles';

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
    getSolutions: userId => {
      dispatch(Actions.fetchSolutionsByUserId(userId));
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
    phototag: this.props.navigation.state.params.phototag,
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
    let isNewPhoto = this.state.photoUri !== this.state.phototag.imageUrl;

    if (isNewPhoto) {
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
          Alert.alert('Success', 'Solution posted', [
            {
              text: 'OK',
              onPress: () => {
                this.props.navigation.goBack();
              },
            },
          ]);
        }
      });
    } else {
      let newSolution = {
        imageUrl: this.state.photoUri,
        isAccepted: false,
        description: this.state.description,
        userId: this.props.user.id,
        phototagId: this.state.phototag.id,
      };
      this.addSolution(this.props.user.id, newSolution);
      Alert.alert('Success', 'Solution posted', [
        {
          text: 'OK',
          onPress: () => {
            this.props.navigation.goBack();
          },
        },
      ]);
    }
  };

  addSolution = (userId, solutionData) => {
    // update the solutions node in firebase
    let newSolutionId = db.child('solutions').push().key;
    solutionData.id = newSolutionId;
    db
      .child('solutions/' + newSolutionId)
      .update(solutionData)
      .then(() => {
        console.log('New solution posted. Id is', newSolutionId);
        // refetch solutions
        this.props.getSolutions(this.props.user.id)
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

  render() {
    return (
      <Image
        style={{ height: '100%', width: '100%' }}
        source={require('../../assets/images/lowBulb.png')}
        resizeMode="cover"
      >
        <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Text style={AppStyles.whiteText}>Describe what you will do or have done:</Text>
          <TextInput
            style={AppStyles.writeDescriptionInput}
            placeholder="i.e. I can move this..., I can repair this..."
            onChangeText={text => this.setState({ description: text })}
            keyboardType={'default'}
            multiline
            ref={input => {
              this.descriptionInput = input;
            }}
          />
          <View>
            <Text style={AppStyles.whiteText}>(Optional) Take an updated image of the fix</Text>
            <Button label="Take new photo"
            onPress={this._takePic}
            styles={{ button: AppStyles.editButton, label: AppStyles.buttonBlueText }}
            />
          </View>
          <Image
            onPress={this.handleSelectImage}
            style={{ width: 300, height: 300, resizeMode: Image.resizeMode.contain }}
            source={{ uri: this.state.photoUri }}
          />
          <Button label="Submit"
            onPress={this.handleSaveSolution}
            styles={{ button: AppStyles.actionButton, label: AppStyles.buttonWhiteText }}
          />
        </KeyboardAwareScrollView>
      </Image>
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
  center: {
    alignItems: 'center',
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(SolverScreen);
