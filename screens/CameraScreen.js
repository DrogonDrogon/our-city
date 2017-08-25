import React from 'react';
import { Button, Image, View, TextInput } from 'react-native';
import { ImagePicker, Location, Permissions } from 'expo';
import * as firebase from 'firebase';
import config from '../config/config.js';

export default class ImagePickerExample extends React.Component {
  state = {
    image: null,
    allImageData: {},
    description: '',
    userName: 'walter',
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
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          placeholder="Enter description"
          onChangeText={text => this.setState({ description: text })}
          keyboardType={'default'}
        />
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

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      let tempImageData = this.state.allImageData;
      tempImageData.imageData = result;
      this.setState({ allImageData: tempImageData });
    }
  };

  _saveImg = () => {
    let allImageData = this.state.allImageData;
    allImageData.userName = this.state.userName;
    allImageData.description = this.state.description;
    allImageData.comments = [];
    allImageData.upvotes = 0;
    allImageData.downvotes = 0;
    let newPostKey = firebase.database().ref().child('photoTags').push().key;
    firebase.database().ref('photoTags/' + newPostKey).update(allImageData);
  };
}
