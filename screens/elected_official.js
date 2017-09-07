import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Share,
  Picker,
  Modal,
  WebView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Hyperlink from 'react-native-hyperlink';

export default class electedOfficails extends React.Component {
  state = {
    phototag: this.props.navigation.state.params.phototag,
    electedOfficailIndex: this.props.navigation.state.params.electedOfficailIndex,
    official: this.props.navigation.state.params.reps.officials[
      this.props.navigation.state.params.electedOfficailIndex
    ],
    modalVisibility: false,
  };
  share() {
    let twitterhandle = '';
    this.state.official.channels.forEach(channel => {
      if (channel.type === 'Twitter') twitterhandle = channel.id;
    });
    Share.share({
      title: this.props.navigation.state.params.description,
      message: ` ${this.props.navigation.state.params.description} @${twitterhandle}`,
      url: this.props.navigation.state.params.imageUrl,
    });
  }
  render() {
    console.log('electedOfficails', this.props.navigation.state.params);
    return (
      <View style={{ alignItems: 'center' }}>
        <Image
          style={{ width: '100%', height: 100, resizeMode: Image.resizeMode.contain }}
          source={{
            uri: this.state.official.photoUrl,
          }}
        />
        <Hyperlink
          onPress={() => this.setState({ modalVisibility: true })}
          linkStyle={{ color: '#2980b9', fontSize: 20 }}>
          <Text style={{ fontSize: 15 }}>{this.state.official.urls[0]}</Text>
        </Hyperlink>
        <TouchableHighlight onPress={this.share.bind(this)}>
          <Ionicons name="logo-twitter" size={32} color="blue" />
        </TouchableHighlight>
        <TouchableHighlight>
          <Ionicons name="logo-facebook" size={32} color="blue" />
        </TouchableHighlight>
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.modalVisibility}
          onRequestClose={() => {
            console.log('Modal closed');
          }}>
          <TouchableHighlight onPress={() => this.setState({ modalVisibility: false })}>
            <Ionicons name="ios-arrow-back" size={32} color="blue" />
          </TouchableHighlight>
          <WebView source={{ uri: this.state.official.urls[0] }} style={{ marginTop: 20 }} />
        </Modal>
      </View>
    );
  }
}
