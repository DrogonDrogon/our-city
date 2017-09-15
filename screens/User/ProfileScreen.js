import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import CustomButton from '../../components/Button';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import NavigationBar from 'react-native-navbar';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { ImagePicker } from 'expo';
import { RNS3 } from 'react-native-aws3';
import firebase from 'firebase';
import config from '../../config/config';
import * as Actions from '../../actions';
import Favourites from './Favourites';
import Posts from './Posts';
import Comments from './Comments';
import AppStyles from '../../styles/AppStyles';

const awsOptions = {
  keyPrefix: 'users/',
  bucket: 'arcity',
  region: 'us-east-1',
  accessKey: config.aws.accessKey,
  secretKey: config.aws.secretKey,
  successActionStatus: 201,
};

const mapStateToProps = (state, ownProps) => {
  // Passes along any updated state that comes from the reducer into the component's props
  return {
    phototags: state.phototags,
    user: state.user,
    isLoading: state.isLoading,
    location: state.location,
    badges: state.badges,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  // Define the function that will be passed as prop
  return {
    listenForPhototags: () => {
      dispatch(Actions.updateLoadingStatus(true));
      dispatch(Actions.listenForPhototags);
    },
    listenForUser: user => {
      dispatch(Actions.listenForUserChanges(user));
    },
    submitUserUpdate: userInfo => {
      dispatch(Actions.updateUser(userInfo));
    },
    getLocation: () => {
      dispatch(Actions.getLocationAsync());
    },
    updatePhototag: phototag => {
      dispatch(Actions.updatePhototag(phototag));
    },
    updateBadge: badges => {
      dispatch(Actions.setBadge(badges));
    },
  };
};

class HomeScreen extends React.Component {
  state = {
    selectedIndex: 0,
    modalVisibility: false,
    navBarTitle: {
      title: 'Edit Profile',
    },
    rightButton: {
      title: 'Save',
      handler: () => {
        this._handleSaveProfile();
      },
    },
    leftButton: {
      title: 'Cancel',
      handler: () => {
        this._toggleModal(false);
      },
    },
    editDisplayNameText: this.props.user.displayName,
    imageUri: this.props.user.photoUrl,
  };

  componentDidMount() {
    this.props.listenForPhototags();
    // this.props.listenForUser(this.props.user);
  }

  _handleIndexChange = index => {
    this.setState({
      ...this.state,
      selectedIndex: index,
    });
  };

  _navigateTo = routeName => {
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })],
    });
    this.props.navigation.dispatch(actionToDispatch);
  };

  _logout = () => {
    console.log('click Logout');
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('Sign out successful');
        this._navigateTo('Login');
      })
      .catch(error => {
        console.log('Error sign out', error);
      });
  };

  goToPhototags = phototag => {
    this.props.navigation.navigate('PhototagFromMap', phototag);
  };

  _handleClickEdit = () => {
    console.log('Click edit profile');
    this.setState({ modalVisibility: true });
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

  deleteBadges(phototag) {
    phototag.badges = 0;
    this.props.updatePhototag(phototag);
  }

  decreaseBadges(decreaseAmount) {
    if (this.props.badges > 0) this.props.updateBadge(this.props.badges - decreaseAmount);
    if ((this, this.props.badges < 0)) this.props.updateBadge(0);
  }

  _handleSaveProfile = () => {
    let didNameChange = this.state.editDisplayNameText !== this.props.user.displayName;
    let didPhotoChange = this.state.image !== this.props.user.photoUrl;

    // Only make the database update if there was a change in name or picture
    if (didNameChange || didPhotoChange) {
      // Set up an updated user object
      let updatedUser = this.props.user;
      if (didNameChange) {
        updatedUser.displayName = this.state.editDisplayNameText;
      }
      if (didPhotoChange) {
        updatedUser.photoUrl = `https://s3.amazonaws.com/${awsOptions.bucket}/${awsOptions.keyPrefix}${this
          .props.user.id}.jpg`;
      }

      // Set up file uri to save to AWS
      let file = {
        uri: this.state.imageUri,
        name: `${this.props.user.id}.jpg`,
        type: 'image/jpg',
      };

      // Make AWS upload request
      RNS3.put(file, awsOptions).then(response => {
        if (response.status !== 201) {
          console.log('[s3 upload] ERROR failed to upload image', response.body);
          // TODO: handle error through alert
        } else {
          console.log('[s3 upload] Success!');
          // Dispatch saving user to firebase
          this.props.submitUserUpdate(updatedUser);
        }
      });
    }
    this._toggleModal(false);
  };

  _toggleModal = bool => {
    this.setState({ modalVisibility: bool });
  };

  renderForm = index => {
    switch (index) {
      case 0:
        return (
          <Posts
            user={this.props.user}
            phototags={this.props.phototags}
            goToPhototags={this.goToPhototags}
            navigation={this.props.navigation}
            deleteBadges={this.deleteBadges.bind(this)}
            decreaseBadges={this.decreaseBadges.bind(this)}
          />
        );
      case 1:
        return (
          <Favourites
            navigation={this.props.navigation}
            deleteBadges={this.deleteBadges.bind(this)}
            decreaseBadges={this.decreaseBadges.bind(this)}
          />
        );
      case 2:
        return (
          <Comments
            navigation={this.props.navigation}
            deleteBadges={this.deleteBadges.bind(this)}
            decreaseBadges={this.decreaseBadges.bind(this)}
          />
        );
      default:
        return <View />;
    }
  };

  render() {
    if (this.props.phototags && this.props.user) {
      // In case user signed up using email/password, displayName doesn't exist unless updated by user, so use email as displayName
      let displayName =
        this.props.user.displayName === '' ? this.props.user.email : this.props.user.displayName;

      return (
        <Image
          style={{ height: '100%', width: '100%' }}
          source={require('../../assets/images/water.png')}
          resizeMode="cover">
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={[styles.container, {flexDirection: 'row', justifyContent: 'space-between'}]}>
              <View style={{flex: 1, flexDirection:'column', alignItems:'center',}}>  
                <Image style={styles.profileImage} source={{ uri: this.props.user.photoUrl }} />
                <Text style={{color:'white',}}>{displayName}</Text>
              </View>  
              <View style={{flex: 1, flexDirection:'column', alignItems:'center',}}>
                <CustomButton
                  label="Edit Profile"
                  onPress={this._handleClickEdit}
                  styles={{ button: AppStyles.editButton, label: AppStyles.buttonBlueText }}
                />
                <CustomButton
                  label="Log Out"
                  onPress={this._logout}
                  styles={{ button: AppStyles.actionButton, label: AppStyles.buttonWhiteText }}
                />
              </View>  
            </View>
            <Modal
              animationType={'slide'}
              transparent={false}
              visible={this.state.modalVisibility}
              onRequestClose={() => {
                console.log('Modal closed');
              }}>
              <NavigationBar
                title={this.state.navBarTitle}
                rightButton={this.state.rightButton}
                leftButton={this.state.leftButton}
              />
              <ScrollView>
                <View style={styles.container}>
                  <Image style={styles.profileImage} source={{ uri: this.state.imageUri }} />
                  <Button
                    title="Change picture"
                    onPress={this._pickImage}
                    style={styles.smallButton}
                  />
                  <Text>
                    Display Name
                    <TextInput
                      value={this.state.editDisplayNameText}
                      keyboardType={'default'}
                      placeholder="Enter name"
                      onChangeText={editDisplayNameText => this.setState({ editDisplayNameText })}
                      style={styles.inputBox}
                    />
                  </Text>
                </View>
              </ScrollView>
            </Modal>
            <SegmentedControlTab
              values={['Posts', 'Favs', 'Comments']}
              selectedIndex={this.state.selectedIndex}
              onTabPress={this._handleIndexChange}
              borderRadius={14}
              tabsContainerStyle={AppStyles.profileTabsContainerStyle}
              tabStyle={AppStyles.tabStyle}
              tabTextStyle={AppStyles.tabTextStyle}
              activeTabStyle={AppStyles.activeTabStyle}
              activeTabTextStyle={AppStyles.activeTabTextStyle}
            />
            {this.renderForm(this.state.selectedIndex)}
            {this.props.isLoading && (
              <View style={styles.loading}>
                <ActivityIndicator animated={this.props.isLoading} size="large" />
              </View>
            )}
          </ScrollView>
        </Image>  
      );
    } else {
      return <ScrollView />;
    }
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  titleText: {
    textAlign: 'center',
    fontSize: 20,
    margin: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  inputBox: {
    borderColor: 'gray',
    borderWidth: 1,
    textAlignVertical: 'top',
    paddingLeft: 5,
    paddingRight: 5,
    width: 100,
    height: 20,
    fontSize: 12,
  },
  smallButton: {
    fontSize: 12,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 330,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
