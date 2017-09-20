import React from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  CameraRoll,
  Alert,
  TouchableHighlight,
} from 'react-native';
import { ImagePicker } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RNS3 } from 'react-native-aws3';
import Button from '../../components/Button';
import * as Actions from '../../actions';
import db from '../../db';
import config from '../../config/config';
import EditPhototagModal from '../../components/editPhototagModal';
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

class ViewSolverScreen extends React.Component {
  // static navigationOptions = {
  //   title: 'Volunteer a Fix',
  // };

  state = {
    solution: this.props.navigation.state.params,
    description: this.props.navigation.state.params.description,
    photoUri: this.props.navigation.state.params.imageUrl,
    modalEditVis: false,
    modalSolutionsVis: false,
    modalNavRightButton: {
      title: 'Save',
      handler: () => {
        this.saveDescription(this.state.editedDescription);
        this.toggleEditModal();
      },
    },
    modalNavLeftButton: {
      title: 'Cancel',
      handler: () => {
        this.toggleEditModal();
      },
    },
    editedDescription: this.props.navigation.state.params.description,
  };

  _takePic = async () => {
    if (this.props.user.id === this.state.solution.userId) {
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
    }
  };

  handleSaveSolution = () => {
    let isNewPhoto = this.state.photoUri !== this.state.solution.imageUrl;

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
            description: this.state.editedDescription,
          };
          this.updateSolution(this.props.user.id, newSolution);
        }
      });
    } else {
      let newSolution = {
        imageUrl: this.state.photoUri,
        description: this.state.editedDescription,
      };
      this.updateSolution(this.props.user.id, newSolution);
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

  saveDescription = description => {
    let updatedData = this.state.solution;
    updatedData.description = description;
    this.setState({ solution: updatedData });
  };

  updateSolution = (userId, solutionData) => {
    // update the solutions node in firebase
    var newSolutionId = this.state.solution.id;
    db
      .child('solutions/' + newSolutionId)
      .update(solutionData)
      .then(() => {
        console.log('Solution updated. Id is', newSolutionId);
        this.props.getSolutions(this.props.user.id);
      })
      .catch(error => console.log('Error writing to solutions', error));
  };

  openEditDescription = () => {
    console.log('Editing description');
    this.toggleEditModal();
  };

  editDescription = description => {
    this.setState({ editedDescription: description });
  };

  toggleEditModal = () => {
    this.setState({ modalEditVis: !this.state.modalEditVis });
  };

  render() {
    let isEditable = this.props.user.id === this.state.solution.userId;
    return (
      <Image
        style={{ height: '100%', width: '100%' }}
        source={require('../../assets/images/lowBulb.png')}
        resizeMode="cover">
        <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Image
            onPress={this.handleSelectImage}
            style={{ width: 300, height: 300, resizeMode: Image.resizeMode.contain }}
            source={{ uri: this.state.photoUri }}
          />
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
            <Text style={AppStyles.whiteText}>{this.state.editedDescription}</Text>
            <EditPhototagModal
              toggleEditModal={this.modalEditVis}
              modalEditVis={this.state.modalEditVis}
              modalNavRightButton={this.state.modalNavRightButton}
              modalNavLeftButton={this.state.modalNavLeftButton}
              editedDescription={this.state.editedDescription}
              editDescription={this.editDescription}
            />
            {isEditable && (
              <TouchableHighlight onPress={this.openEditDescription}>
                <Ionicons name="md-create" size={28} color="white" style={{ marginLeft: 10 }} />
              </TouchableHighlight>
            )}
          </View>
          <View>
            <Text style={AppStyles.whiteTextTitle}>(Optional) Take an updated image of the fix</Text>
            <Button label="Edit photo"
            onPress={this._takePic}
            styles={{ button: AppStyles.editButton, label: AppStyles.buttonBlueText }}
          />
          </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewSolverScreen);
