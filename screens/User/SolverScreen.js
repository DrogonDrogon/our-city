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
    image: null,
    allImageData: {},
    description: '',
    tags: [],
    reps: {},
    latitude: '',
    longitude: '',
    imageHasLocationExif: false,
  };

  render() {
    return (
      <View>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Enter description"
          onChangeText={text => this.setState({ description: text })}
          keyboardType={'default'}
          multiline
          ref={input => (this.descriptionInput = input)}>
        </TextInput>
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