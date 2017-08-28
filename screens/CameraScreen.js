import React from 'react';
import { connect } from 'react-redux';
import { Button, Image, View, TextInput, ActivityIndicator } from 'react-native';
import { ImagePicker, Location, Permissions } from 'expo';
import * as Actions from '../redux/actions';

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    isPosting: state.isPosting,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    submitOnePhototag: phototag => {
      dispatch(Actions.postPhototagRequested(phototag));
      dispatch(Actions.updatePostingStatus(true));
    },
  };
};

class CameraScreen extends React.Component {
  state = {
    image: null,
    allImageData: {},
    description: '',
    userName: 'walter',
    userId: 123,
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
      this.setState({ allImageData: imageData });
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
    // Set up the format for phototag item to be saved
    let phototag = {};
    phototag.userId = this.props.user.id;
    phototag.userName = this.props.user.displayName;
    phototag.description = this.state.description;
    phototag.imageDataIn64 = this.state.allImageData.imageData.base64;
    phototag.imageHeight = this.state.allImageData.imageData.height;
    phototag.imageWidth = this.state.allImageData.imageData.width;
    phototag.locationLat = this.state.allImageData.location.coords.latitude;
    phototag.locationLong = this.state.allImageData.location.coords.longitude;
    phototag.timestamp = this.state.allImageData.location.timestamp;
    phototag.upvotes = 0;
    phototag.downvotes = 0;
    phototag.comments = ['like', 'dislike'];
    this.props.submitOnePhototag(phototag);
    console.log('USSER', this.props.user);
  };

  render() {
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Pick an image from camera roll" onPress={this._pickImage} />
        <Button title="Use camera" onPress={this._takePic} />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          placeholder="Enter description"
          onChangeText={text => this.setState({ description: text })}
          keyboardType={'default'}
        />
        <Button title="Upload my post" onPress={this._saveImg} />
        {this.props.isPosting && <ActivityIndicator animated={this.props.isPosting} size="large" />}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen);
