import React from 'react';
import { Button, Image, View } from 'react-native';
import { ImagePicker, Location, Permissions } from 'expo';
import * as firebase from 'firebase';
import config from '../config/config.js';

export default class ImagePickerExample extends React.Component {
  state = {
    image: null,
    allImageData: {},
  };
  _;

  componentWillMount() {
    const getLocationAsync = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(location);
      let imageData = this.state.allImageData;

      imageData.location = location;
      this.setState({ allImageDataimageData: imageData });
    };
    getLocationAsync();
  }

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Pick an image from camera roll" onPress={this._pickImage} />
        <Button title="take Picture" onPress={this._takePic} />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        <Button title="upload image" onPress={this._saveImg} />
      </View>
    );
  }
  _takePic = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      exif: true,
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      let tempImageData = this.state.allImageData;
      tempImageData.imageData = result;
      this.setState({ allImageData: tempImageData });
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      exif: true,
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      let tempImageData = this.state.allImageData;
      tempImageData.imageData = result;
      this.setState({ allImageData: tempImageData });
    }
  };

  _saveImg = () => {
    console.log(this.state.allImageData);
    firebase.database().ref('photoTags/testupload').set(this.state.allImageData);
  };
}
