import React from 'react';
import { connect } from 'react-redux';
import {
  Image,
  TextInput,
  Text,
  ActivityIndicator,
  Alert,
  CameraRoll,
  View,
  TouchableHighlight,
} from 'react-native';
import Button from '../components/Button';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImagePicker, Location, Permissions } from 'expo';
import { RNS3 } from 'react-native-aws3';
import * as Actions from '../actions';
import config from '../config/config';
import axios from 'axios';
import Colors from '../constants/Colors';
import AppStyles from '../styles/AppStyles';

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
    reps: {},
    latitude: '',
    longitude: '',
    imageHasLocationExif: false,
    address: '',
  };

  _takePic = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      base64: true,
      exif: true,
    });

    if (!result.cancelled) {
      CameraRoll.saveToCameraRoll(result.uri);
      this.setState({ imageUri: result.uri });
      this.getReps();
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [16, 9],
      base64: true,
      exif: true,
    });

    if (!result.cancelled) {
      this.setState({ imageUri: result.uri });
      // If the image has exif location data
      if (result.exif.GPSLatitudeRef && result.exif.GPSLongitudeRef) {
        let latitude =
          result.exif.GPSLatitudeRef === 'N'
            ? result.exif.GPSLatitude
            : result.exif.GPSLatitude * -1;
        let longitude =
          result.exif.GPSLongitudeRef === 'E'
            ? result.exif.GPSLongitude
            : result.exif.GPSLongitude * -1;
        console.log('[pickImage] Lat/Lon from image result.exif', latitude, longitude);
        this.setState({
          imageHasLocationExif: true,
          latitude,
          longitude,
        });
        this.getReps(latitude, longitude);
      } else {
        // If image has NO exif location data, then cannot getReps using image location
        console.log('[pickImage] NO location from image result.exif');
        this.setState({ imageHasLocationExif: false });
        this.getReps(this.props.location.latitude, this.props.location.longitude);
      }
    }
  };

  getReps(latitude, longitude) {
    Location.reverseGeocodeAsync({
      latitude: latitude || this.props.location.latitude,
      longitude: longitude || this.props.location.longitude,
    }).then(address => {
      console.log(
        '[getReps] reverseGeoCode address',
        address,
        `${address[0].name} ${address[0].city} ${address[0].region} ${address[0].postalCode}`
      );
      this.setState({
        address: `${address[0].name} ${address[0].city} ${address[0].region} ${address[0]
          .postalCode}`,
      });
      axios
        .get('https://www.googleapis.com/civicinfo/v2/representatives', {
          params: {
            'Content-Type': 'application/json',
            key: config.google.key,
            address: `${address[0].name} ${address[0].city} ${address[0].region} ${address[0]
              .postalCode}`,
          },
        })
        .then(data => {
          //data = JSON.stringify(data).replace('\\', '');
          let offices = data.data.offices;
          offices.splice(3, 0, { name: 'United States Senate 2' });
          this.setState({ reps: { officials: data.data.officials, offices } }, () => {
            //console.log('reps', this.state.reps);
          });
        })
        .catch(error => {
          // If no representative data returned, then phototag will have no reps property
          console.log('[getReps] Unable get reps -->', error);
        });
    });
  }

  _saveImg = async () => {
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

      // Handle tags
      phototag.tags = {};
      let desc = this.state.description;
      if (desc.match(/#[^\s]*/g)) {
        var hashtags = desc.match(/#[^\s]*/g).map(str => str.slice(1));
        hashtags.forEach(str => (phototag.tags[str] = true));
      }
      console.log('[saveImg] phototag.tags: ', phototag.tags);

      // Save image's location if available, otherwise use current location as location data
      if (this.state.imageHasLocationExif) {
        phototag.locationLat = this.state.latitude;
        phototag.locationLong = this.state.longitude;
      } else {
        phototag.locationLat = this.props.location.latitude;
        phototag.locationLong = this.props.location.longitude;
      }
      phototag.imageUrl = `https://s3.amazonaws.com/${awsOptions.bucket}/${awsOptions.keyPrefix}${photoIdName}.jpg`;
      phototag.upvotes = 0;
      phototag.downvotes = 0;
      phototag.favTotal = 0;
      phototag.comments = { placeholderComment: true };
      phototag.solutions = { solutionId: true };
      phototag.userProfileUrl = this.props.user.photoUrl;
      phototag.address = this.state.address;
      phototag.badges = 0;
      phototag.reps = this.state.reps;
      console.log('[saveImg] phototag.reps: ', phototag.reps);

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
          this.setState({
            latitude: '',
            longitude: '',
            imageHasLocationExif: false,
            description: '',
          });

          // TODO: Error handling if post not successful from firebase
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
    let token,
      index,
      parts = [];
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
    parts = parts.map(text => {
      if (/^#/.test(text)) {
        return (
          <Text key={text} style={styles.hashtag}>
            {text}
          </Text>
        );
      } else {
        return text;
      }
    });

    return (
      <Image
        style={{ height: '100%', width: '100%' }}
        source={require('../assets/images/cameraBack.png')}
        resizeMode="cover">
        <KeyboardAwareScrollView contentContainerStyle={styles.center} behavior="padding">
          <View style={styles.view}>
            <Text style={styles.text}>Show Us What The World Could Be</Text>
          </View>
          <View style={AppStyles.imageHolder}>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.imageSetting} />}
          </View>
          <View style={AppStyles.containerRow}>
            <TouchableHighlight onPress={this._takePic}>
              <FontAwesome
                name="camera-retro"
                size={40}
                color="white"
                style={{ backgroundColor: 'transparent' }}
              />
            </TouchableHighlight>
            <TouchableHighlight onPress={this._pickImage}>
              <MaterialIcons
                name="camera-roll"
                size={40}
                color="white"
                style={{ backgroundColor: 'transparent' }}
              />
            </TouchableHighlight>
          </View>
          <View style={styles.view}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Enter description"
              onChangeText={text => this.setState({ description: text })}
              keyboardType={'default'}
              multiline
              ref={input => (this.descriptionInput = input)}>
              <Text>{parts}</Text>
            </TextInput>
            <Button
              label="Post"
              onPress={this._saveImg}
              styles={{ button: AppStyles.actionButton, label: AppStyles.buttonWhiteText }}
            />
          </View>
        </KeyboardAwareScrollView>
      </Image>
    );
  }
}

const styles = {
  imageSetting: {
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  descriptionInput: {
    // height: 80,
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 1,
    // width: '80%',
    textAlignVertical: 'top',
    fontSize: 16,
    padding: 10,
    color: 'white',

  },
  center: {
    alignItems: 'center',
  },
  hashtag: {
    color: 'blue',
    fontWeight: 'bold',
  },
  view: {
    flex: 1,
    alignItems: 'center',
    // margin: 20,
    backgroundColor: 'transparent',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 40,
    textAlign: 'center',
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen);
