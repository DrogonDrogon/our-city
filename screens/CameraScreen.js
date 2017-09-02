import React from 'react';
import { connect } from 'react-redux';
import { Button, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImagePicker, Location, Permissions } from 'expo';
import { RNS3 } from 'react-native-aws3';
import * as Actions from '../actions';
import config from '../config/config';

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
    isLoading: state.isLoading,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    submitOnePhototag: phototag => {
      dispatch(Actions.postPhototagRequested(phototag));
      dispatch(Actions.updateLoadingStatus(true));
    },
  };
};

const generateRandomID = () => {
  return 'xxxxx-xx4xxxy-xxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

class CameraScreen extends React.Component {
  state = {
    image: null,
    allImageData: {},
    description: '',
  };

  componentWillMount() {
    const getLocationAsync = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log('[CameraScreen] location gotten', location);
      this.setState({ location });
    };
    getLocationAsync();
  }

  _takePic = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      exif: true,
    });

    if (!result.cancelled) {
      this.setState({ imageUri: result.uri });
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      exif: true,
    });

    if (!result.cancelled) {
      this.setState({ imageUri: result.uri });
    }
  };

  _saveImg = () => {
    // Check to see if all fields filled in
    if (this.state.imageUri === null || this.state.description === '') {
      Alert.alert('Error', 'Please select a photo and fill in description', [
        { text: 'OK', onPress: () => {} },
      ]);
    } else {
      // Set up the format for phototag item to be saved in Firebase
      let phototag = {};
      let photoIdName = generateRandomID();
      let timestamp = new Date();
      timestamp = timestamp.toUTCString();
      phototag.timestamp = timestamp;
      phototag.userId = this.props.user.id;
      phototag.userName = this.props.user.displayName;
      phototag.description = this.state.description;
      phototag.locationLat = this.state.location.coords.latitude;
      phototag.locationLong = this.state.location.coords.longitude;
      phototag.imageUrl = `https://s3.amazonaws.com/${awsOptions.bucket}/${awsOptions.keyPrefix}${photoIdName}.jpg`;
      phototag.upvotes = 0;
      phototag.downvotes = 0;
      phototag.comments = ['like', 'dislike'];
      phototag.userProfileUrl = this.props.user.photoUrl;

      // Set up file uri to save to AWS
      let file = {
        uri: this.state.imageUri,
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
          // Dispatch saving user to firebase
          this.props.submitOnePhototag(phototag);

          // Reset image and description
          this.setState({ imageUri: null });
          this.descriptionInput.setNativeProps({ text: '' });
          Alert.alert('Success', 'Your post was sent!', [{ text: 'OK', onPress: () => {} }]);
        }
      });
    }
  };

  render() {
    let { imageUri } = this.state;

    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.center} behavior="padding">
        <Button title="Pick an image from camera roll" onPress={this._pickImage} />
        <Button title="Use camera" onPress={this._takePic} />
        {imageUri && <Image source={{ uri: imageUri }} style={styles.imageSetting} />}
        <TextInput
          style={styles.descriptionInput}
          placeholder="Enter description"
          onChangeText={text => this.setState({ description: text })}
          keyboardType={'default'}
          multiline
          ref={input => (this.descriptionInput = input)}
        />
        <Button title="Upload my post" onPress={this._saveImg} />
      </KeyboardAwareScrollView>
    );
  }
}

const styles = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen);
