import React from 'react';
import { MapView, Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import { Button, Text, Image, StyleSheet, View, ScrollView } from 'react-native';
import db from '../../db';
import MarkerTag from '../../components/markerTag';
import ListView from './ListView.js';

const mapStateToProps = (state, ownProps) => {
  return {
    phototags: state.phototags,
  };
};

class MapScreen extends React.Component {
  static navigationOptions = { header: null };
  // static navigationOptions = ({ navigation }) => {
  // }

  state = {
    region: {
      latitude: 40.750355960509054,
      longitude: -73.97669815393424,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    markers: {},
    isMapToggled: false,
  };

  componentWillMount() {
    this.getLocation();
    this.setState({ markers: this.props.phototags });
    //this.setMarkersByDistance();
    Location.watchPositionAsync(location => {
      this.setLocation(location);
      //this.setMarkersByDistance();
    });
  }

  toggleView = () => {
    let reverse = !this.state.isMapToggled;
    this.setState({ isMapToggled: reverse }, () => {
      console.log('toggled', this.state.isMapToggled);
    });
  };

  goToPhototags(marker) {
    this.props.navigation.navigate('phototagFromMap', marker);
  }

  getLocation() {
    const getLocationAsync = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }
      let location = await Location.getCurrentPositionAsync({});
      this.setLocation(location);
    };

    getLocationAsync();
  }
  setLocation(location) {
    let tempRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    console.log(tempRegion);
    this.setState({ region: tempRegion });
  }

  checkDistance(
    lat1,
    lon1,
    lat2 = this.state.region.latitude,
    lon2 = this.state.region.longitude,
    distance = 10
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
    console.log(d);
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

  render() {
    if (this.state.isMapToggled === true) {
      return (
        <MapView
          showsUserLocation
          followsUserLocation
          toolbarEnabled
          provider={MapView.PROVIDER_GOOGLE}
          style={styles.map}
          region={this.state.region}>
          <Button style={styles.toggleButton} onPress={this.toggleView} title="Switch to List" />

          {this.props.phototags &&
            this.props.phototags
              .filter(marker => this.checkDistance(marker.locationLat, marker.locationLong))
              .map((markerMapped, i) => (
                <MapView.Marker
                  key={i}
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
      );
    } else {
      return (
        <View style={styles.container}>
        <Button style={styles.toggleButton} onPress={this.toggleView} title="Switch to Map" />
        <ListView />
        </View>
      );
    }
  }
}

export default connect(mapStateToProps)(MapScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
    alignItems: 'center',
  },
  map: {
    flex: 1,
    marginTop: 25,
  },
  toggleButton: {},
  descriptionText: {
    marginTop: 10,
    marginBottom: 20,
  },
});
