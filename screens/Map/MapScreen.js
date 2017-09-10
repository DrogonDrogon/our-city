import React from 'react';
import { MapView, Location, Notifications } from 'expo';
import { connect } from 'react-redux';
import { Button, Text, Image, StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import db from '../../db';
import MarkerTag from '../../components/markerTag';
import ListView from './ListView.js';
import FilterScreen from './FilterScreen';
import * as Actions from '../../actions';
import axios from 'axios';
//import registerForPushNotificationsAsync from 'registerForPushNotificationsAsync';
const mapStateToProps = (state, ownProps) => {
  return {
    phototags: state.phototags,
    location: state.location,
    user: state.user,
    isLoading: state.isLoading,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  // Define the function that will be passed as prop
  return {
    getLocation: () => {
      dispatch(Actions.getLocationAsync());
    },
  };
};

class MapScreen extends React.Component {
  state = {
    // the intial location must be set because props take time to init it could be anything
    region: {
      latitude: 40.75122,
      longitude: -73.976698,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    markers: [],
    isMapToggled: true,
    modalVisible: false,
    tags: [],
    filters: {
      selectedTags: [],
      numResults: 25,
      radius: 5,
      favorites: false,
      sortBy: 'Date',
      FavIsSelected: false,
      user: null,
    },
  };

  componentDidMount() {
    axios
      .post('http://cd41a62b.ngrok.io/notification', {
        message: 'welcome to our app',
        userid: this.props.user.id,
      })
      .then(res => {
        console.log(res.data);
      });
    let locationOptions = {
      enableHighAccuracy: true,
      distanceFilter: 10,
      maximumAge: 1000,
      timeout: 20000,
    };
    Location.watchPositionAsync(locationOptions, location => {
      if (
        this.state.region.latitude !== location.coords.latitude &&
        this.state.region.longitude !== location.coords.longitude
      ) {
        console.log(
          `[watchPosition] old loc ${this.state.region.latitude} ${this.state.region
            .longitude} --> new loc ${location.coords.latitude} ${location.coords.longitude}`
        );
        // Only call getLocation if the location changed
        this.props.getLocation();
      }
    }).catch(err => {
      console.log('[watchPosition]', err);
      Alert.alert(
        'Unable to get location',
        'Please ensure location permissions are enabled for this app.'
      );
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params) {
      let Params = nextProps.navigation.state.params;
      console.log('Params: ', Params);
      if (Params.navFromLink) {
        this.setState({
          isMapToggled: Params.isMapToggled,
          filters: Params.filters,
          tags: Params.tags,
        });
      }
    }
    // Ensure the props received are the location props and that they are not empty, before updating location state
    if (!!nextProps.location.latitude && !!nextProps.location.longitude) {
      this.setLocation(nextProps.location);
    }

    // If location permissions are not enabled, alert with error
    if (nextProps.location && nextProps.location.error) {
      Alert.alert('Error', nextProps.location.error);
    }
  }

  toggleView = () => {
    let reverse = !this.state.isMapToggled;
    this.setState({ isMapToggled: reverse }, () => {
      console.log('toggled', this.state.isMapToggled);
    });
  };

  goToPhototags(marker) {
    this.props.navigation.navigate('PhototagFromMap', marker);
  }

  setLocation(location) {
    let tempRegion = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    this.setState({ region: tempRegion });
  }

  getFilters(filters) {
    this.setState({
      filters,
    });
  }

  filterPhotoTags(photoTags) {
    let filters = this.state.filters;
    let filtered = [];
    let fTags = filters.selectedTags;
    if (fTags.length) {
      for (let i = 0; i < fTags.length; i++) {
        for (let j = 0; j < photoTags.length; j++) {
          if (photoTags[j].tags && photoTags[j].tags.hasOwnProperty(fTags[i])) {
            filtered.push(photoTags[j]);
          }
        }
      }
    } else {
      filtered = photoTags;
    }
    if (filters.FavIsSelected) {
      filtered = filtered.filter(pTag => {
        return this.props.user.favs.hasOwnProperty(pTag.id);
      });
    }
    //when filtering for tags, need to make sure that photo has all of the tags in the array

    return filtered;
  }

  genFilterTags() {
    let tags = this.state.tags;
    this.props.phototags.forEach(pTag => {
      if (pTag.tags && Object.keys(pTag.tags)) {
        let keys = Object.keys(pTag.tags);
        for (let i = 0; i < keys.length; i++) {
          if (!tags.includes(keys[i])) {
            tags.push(keys[i]);
          }
        }
      }
    });
    if (tags.length !== this.state.tags.length) {
      this.setState({ tags });
    }
  }

  sortPhotoTags(photoTags) {
    let sortBy = this.state.filters.sortBy;
    if (sortBy === 'Date') {
      return photoTags.sort((a, b) => {
        return Date.parse(b.timestamp) - Date.parse(a.timestamp);
      });
    }
    if (sortBy === 'Popular') {
      return photoTags.sort((a, b) => {
        let result = b.upvotes * Date.parse(b.timestamp) - a.upvotes * Date.parse(a.timestamp);
        console.log('popular filter', result);
        return result;
      });
    }
    if (sortBy === 'Votes') {
      return photoTags.sort((a, b) => {
        return a.upvotes - a.downvotes - (b.upvotes - b.downvotes);
      });
    }
    if (sortBy === 'Favorites') {
      return photoTags.sort((a, b) => {
        return a.favTotal - b.favTotal;
      });
    }
    return photoTags;
  }

  checkDistance(
    distance = 10,
    lat1,
    lon1,
    lat2 = this.state.region.latitude,
    lon2 = this.state.region.longitude
  ) {
    const deg2rad = deg => {
      return deg * (Math.PI / 180);
    };
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    // console.log(d);
    if (d > distance) return false;
    return true;
  }

  setMarkersByDistance() {
    var tempMarkers = [];
    this.state.markers.forEach(marker => {
      if (this.checkDistance(marker.locationLat, marker.locationLong)) {
        tempMarkers.push(marker);
      }
    });
    this.setState({ markers: tempMarkers }, () => {
      console.log('markers', this.state.markers);
    });
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    if (this.state.isMapToggled === true) {
      return (
        <View style={{ height: '100%' }}>
          <FilterScreen
            filters={this.state.filters}
            tags={this.state.tags}
            getFilters={this.getFilters.bind(this)}
            genFilterTags={this.genFilterTags.bind(this)}
          />
          <Button onPress={this.toggleView} title="Switch to List" />
          <MapView
            showsUserLocation
            followsUserLocation
            toolbarEnabled
            provider={MapView.PROVIDER_GOOGLE}
            style={styles.map}
            region={this.state.region}>
            {this.props.phototags &&
              this.filterPhotoTags(this.props.phototags)
                .filter(marker =>
                  this.checkDistance(
                    this.state.filters.radius,
                    marker.locationLat,
                    marker.locationLong
                  )
                )
                .slice(0, this.state.filters.numResults)
                .map((markerMapped, i) => (
                  <MapView.Marker
                    key={markerMapped.id}
                    coordinate={{
                      latitude: markerMapped.locationLat,
                      longitude: markerMapped.locationLong,
                    }}
                    title={markerMapped.description}>
                    <MapView.Callout tooltip onPress={this.goToPhototags.bind(this, markerMapped)}>
                      <MarkerTag phototag={markerMapped} />
                    </MapView.Callout>
                  </MapView.Marker>
                ))}
          </MapView>
        </View>
      );
    } else {
      return (
        <View style={{ height: '100%' }}>
          <FilterScreen
            filters={this.state.filters}
            tags={this.state.tags}
            getFilters={this.getFilters.bind(this)}
            genFilterTags={this.genFilterTags.bind(this)}
          />
          <Button onPress={this.toggleView} title="Switch to Map" />
          <ListView
            phototags={this.sortPhotoTags(this.filterPhotoTags(this.props.phototags)).slice(
              0,
              this.state.filters.numResults
            )}
            navigation={this.props.navigation}
          />
          {this.props.isLoading && (
            <View style={styles.loading}>
              <ActivityIndicator animated={this.props.isLoading} size="large" />
            </View>
          )}
        </View>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 50,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF88',
  },
});
