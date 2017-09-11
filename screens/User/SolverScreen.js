import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  Button,
  TouchableHighlight,
  Share,
  Modal,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import * as Actions from '../../actions';
import db from '../../db';
import config from '../../config/config';
import axios from 'axios';

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
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
  state = {
    phototag: Object.assign({}, this.props.navigation.state.params),
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
    editedDescription: '',
  };

  openEditDescription = () => {
    console.log('Editing description');
    this.toggleModal(true);
  };

  editDescription = description => {
    this.setState({ editedDescription: description });
  };

  saveDescription = description => {
    let updatedData = this.state.phototag;
    updatedData.description = description;
    this.setState({ phototag: updatedData }, () => {
      this.setState({ editedDescription: description });
    });
  };

  toggleModal = bool => {
    this.setState({ modalVisibility: bool });
  };

  render() {
    return (
      <View>
        <Text style={{ height: '50%', width: '80%', backgroundColor: 'white'}}>
          {this.state.editedDescription}
        </Text>
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.modalVisibility}
          onRequestClose={() => {}}>
          <NavigationBar
            title={this.state.modalNavTitle}
            rightButton={this.state.modalNavRightButton}
            leftButton={this.state.modalNavLeftButton}
          />
          <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.photoDisplayContainer}>
              <Image
                style={{ width: '100%', height: '100%', resizeMode: Image.resizeMode.contain }}
                source={{ uri: this.state.phototag.imageUrl }}
              />
              <TextInput
                value={this.state.editedDescription}
                placeholder="Enter description"
                onChangeText={text => this.editDescription(text)}
                clearButtonMode={'always'}
                style={styles.descriptionInput}
                multiline
              />
            </View>
          </KeyboardAwareScrollView>
        </Modal>
        <TouchableHighlight onPress={this.openEditDescription}>
          <Ionicons name="md-create" size={28} color="gray" style={styles.iconStyle} />
        </TouchableHighlight>
      </View>
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

export default connect(mapStateToProps)(SolverScreen);