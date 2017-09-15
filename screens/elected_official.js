import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  Share,
  Picker,
  Linking,
  Button,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import AppStyles from '../styles/AppStyles';

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
          socialIds.fb = `${officialInfo.channels[i].id}`;
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
      message: `There are ${this.state.phototag.upvotes +
        1} voter(s) who think that this change should happen${this.state.phototag
        .description} ${this.state.twitterId} at ${this.state.phototag.address || ''}`,
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
  };

  _handleOpenWithBrowser = () => {
    let currentSelectedOfficial = this.state.phototag.reps.officials[
      this.state.electedOfficialIndex
    ];
    WebBrowser.openBrowserAsync(currentSelectedOfficial.urls[0]);
  };

  render() {
    let currentSelectedOfficial = this.state.phototag.reps.officials[
      this.state.electedOfficialIndex
    ];

    return (
      <Image
        style={{ height: '100%', width: '100%', alignItems: 'center' }}
        source={require('../assets/images/civic.jpg')}
        resizeMode="cover">
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Picker
            style={styles.picker}
            itemStyle={styles.pickerItem}
            selectedValue={this.state.electedOfficialPositionName}
            onValueChange={(itemValue, itemIndex) =>
              this.updateSelectedOfficial(itemValue, itemIndex)}>
            {this.state.phototag.reps.offices
              .reverse()
              .map((office, i) => <Picker.Item key={i} label={office.name} value={office.name} />)}
          </Picker>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Image
                style={{ width: 100, height: 100, resizeMode: Image.resizeMode.contain }}
                source={{
                  uri: currentSelectedOfficial.photoUrl,
                }}
              />
            </View>
            <View style={{ flexDirection: 'column', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
              <Text>{currentSelectedOfficial.name}</Text>
              <Text onPress={this._handleOpenWithBrowser} style={styles.urlLink}>
                {currentSelectedOfficial.urls[0]}
              </Text>
              {this.state.twitterId !== '' && (
                <Text onPress={this.share}>
                  <Ionicons name="logo-twitter" size={32} color="blue" />
                  <Text>{this.state.twitterId}</Text>
                </Text>
              )}
              {this.state.fbId !== '' && (
                <Text onPress={this.share}>
                  <Ionicons name="logo-facebook" size={32} color="blue" />
                  <Text>{this.state.fbId}</Text>
                </Text>
              )}
              {this.state.emailId !== '' && (
                <Text onPress={this._handleOpenEmail}>
                  <Ionicons name="md-mail" size={32} color="blue" />
                  <Text>{this.state.emailId}</Text>
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  urlLink: {
    fontSize: 12,
    color: 'blue',
  },
  picker: {
    width: '95%',
    height: 100,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    marginTop: 180,
    backgroundColor: 'transparent',
  },
  pickerItem: {
    height: 100,
    color: 'white',
    fontSize: 16,
  },
});
