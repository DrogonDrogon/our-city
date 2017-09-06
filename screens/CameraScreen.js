import React from 'react';
import { connect } from 'react-redux';
import { Button, Image, TextInput, Text, ActivityIndicator, Alert, CameraRoll } from 'react-native';
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
    location: state.location,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    postNewPhototag: phototag => {
      dispatch(Actions.postNewPhototag(phototag));
      dispatch(Actions.updateLoadingStatus(true));
    },
    submitUserUpdate: user => {
      dispatch(Actions.updateUser(user));
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

class CameraScreen extends React.Component {
  state = {
    image: null,
    allImageData: {},
    description: '',
    tags: [],
  };

  _takePic = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      exif: true,
    });

    if (!result.cancelled) {
      CameraRoll.saveToCameraRoll(result.uri);
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
      
      let hashtags = this.state.description.match(/#[^\s]*/g).map(str => str.slice(1));
      console.log('HASHTAGS:', hashtags);
      let phototag = {};
      let photoIdName = generateRandomID();
      let timestamp = new Date();
      timestamp = timestamp.toUTCString();
      phototag.timestamp = timestamp;
      phototag.userId = this.props.user.id;
      phototag.userName = this.props.user.displayName;
      phototag.description = this.state.description;
      phototag.locationLat = this.props.location.latitude;
      phototag.locationLong = this.props.location.longitude;
      phototag.imageUrl = `https://s3.amazonaws.com/${awsOptions.bucket}/${awsOptions.keyPrefix}${photoIdName}.jpg`;
      phototag.upvotes = 0;
      phototag.downvotes = 0;
      phototag.comments = ['like', 'dislike'];
      phototag.userProfileUrl = this.props.user.photoUrl;
      console.log('phototag', phototag);
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
          // Dispatch saving to firebase
          this.props.postNewPhototag(phototag);

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
    //define delimiter
    let delimiter = /\s+/;

    //split string
    let _text = this.state.description;
    let token, index, parts = [];
    while (_text) {
      delimiter.lastIndex = 0;
      token = delimiter.exec(_text);
      if (token === null) {
        break;
      }
      index = token.index;
      if (token[0].length === 0) {
        index = 1;
      }
      parts.push(_text.substr(0, index));
      parts.push(token[0]);
      index = index + token[0].length;
      _text = _text.slice(index);
    }
    parts.push(_text);

    //highlight hashtags
    parts = parts.map((text) => {
      if (/^#/.test(text)) {
        return <Text key={text} style={styles.hashtag}>{text}</Text>;
      } else {
        return text;
      }
    });

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
          ref={input => (this.descriptionInput = input)}>
          <Text>{parts}</Text>
        </TextInput>

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
  hashtag: {
    color: 'blue',
    fontWeight: 'bold',
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen);
