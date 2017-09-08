import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  Share,
  Picker,
  Linking,
  Button,
} from 'react-native';
import { WebBrowser } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import Hyperlink from 'react-native-hyperlink';

export default class electedOfficials extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Contact an Official',
    };
  };

  state = {
    electedOfficialPositionName: '',
    electedOfficialIndex: 0,
    phototag: this.props.navigation.state.params.phototag,
    twitterId: '',
    fbId: '',
    emailId: '',
  };

  componentDidMount() {
    this.getSocialIds();
    this.getEmail();
  }

  getSocialIds = () => {
    let officialInfo = this.state.phototag.reps.officials[this.state.electedOfficialIndex];
    if (officialInfo.channels) {
      let socialIds = {
        fb: '',
        twitter: '',
      };
      for (let i = 0; i < officialInfo.channels.length; i++) {
        if (officialInfo.channels[i].type === 'Twitter') {
          socialIds.twitter = `@${officialInfo.channels[i].id}`;
        } else if (officialInfo.channels[i].type === 'Facebook') {
          socialIds.fb = `/${officialInfo.channels[i].id}`;
        }
      }
      this.setState({ twitterId: socialIds.twitter, fbId: socialIds.fb }, () => {
        console.log('twitter', socialIds.twitter, '&& fb', socialIds.fb);
      });
    } else {
      this.setState({ twitterId: '', fbId: '' });
    }
  };

  getEmail = () => {
    let officialInfo = this.state.phototag.reps.officials[this.state.electedOfficialIndex];
    if (officialInfo.emails) {
      this.setState({ emailId: officialInfo.emails[0] });
    } else {
      this.setState({ emailId: '' });
    }
  };

  share = () => {
    Share.share({
      title: this.state.phototag.description,
      message: `${this.state.phototag.description} ${this.state.twitterId}`,
      url: this.state.phototag.imageUrl,
    });
  };

  updateSelectedOfficial = (itemValue, itemIndex) => {
    this.setState(
      {
        electedOfficialPositionName: itemValue,
        electedOfficialIndex: itemIndex,
      },
      () => {
        this.getSocialIds();
        this.getEmail();
      }
    );
  };

  _handleOpenEmail = () => {
    Linking.openURL(`mailto:${this.state.emailId}`);
  }

  _handleOpenWithBrowser = () => {
    let currentSelectedOfficial = this.state.phototag.reps.officials[
      this.state.electedOfficialIndex
    ];
    WebBrowser.openBrowserAsync(currentSelectedOfficial.urls[0])
  }

  render() {
    let currentSelectedOfficial = this.state.phototag.reps.officials[
      this.state.electedOfficialIndex
    ];

    return (
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Picker
          style={styles.pickerStyle}
          selectedValue={this.state.electedOfficialPositionName}
          onValueChange={(itemValue, itemIndex) =>
            this.updateSelectedOfficial(itemValue, itemIndex)}>
          {this.state.phototag.reps.offices.map((office, i) => (
            <Picker.Item
              key={i}
              label={office.name}
              value={office.name}
              style={styles.pickerItemStyle}
            />
          ))}
        </Picker>
        <Image
          style={{ width: '100%', height: 100, resizeMode: Image.resizeMode.contain }}
          source={{
            uri: currentSelectedOfficial.photoUrl,
          }}
        />
        <Text>{currentSelectedOfficial.name}</Text>
        <Button title={currentSelectedOfficial.urls[0]} onPress={this._handleOpenWithBrowser} style={styles.urlButton} />
        {this.state.twitterId !== '' && (
          <TouchableHighlight onPress={this.share}>
            <Text>
              <Ionicons name="logo-twitter" size={32} color="blue" />
              <Text>{this.state.twitterId}</Text>
            </Text>
          </TouchableHighlight>
        )}
        {this.state.fbId !== '' && (
          <TouchableHighlight>
            <Text>
              <Ionicons name="logo-facebook" size={32} color="blue" />
              <Text>{this.state.fbId}</Text>
            </Text>
          </TouchableHighlight>
        )}
        {this.state.emailId !== '' && (
          <Text onPress={this._handleOpenEmail}>
            <Ionicons name="md-mail" size={32} color="blue" />
            <Text>{this.state.emailId}</Text>
          </Text>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  pickerStyle: {
    width: '95%',
    height: 200,
  },
  pickerItemStyle: {
    fontSize: 10,
  },
  urlButton: {
    fontSize: 12,
  }
});
