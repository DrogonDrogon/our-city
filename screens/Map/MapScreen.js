import React from 'react';
import { MapView, Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import { Text, Image, StyleSheet } from 'react-native';
import db from '../../db';
import MarkerTag from '../../components/markerTag';

const mapStateToProps = (state, ownProps) => {
  return {
    phototags: state.phototags,
  };
};

class MapScreen extends React.Component {
  state = {
    region: {
      latitude: 40.750355960509054,
      longitude: -73.97669815393424,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    markers: {},
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
    distance = 1000
  ) {
    Number.prototype.toRadians = () => {
      return this * Math.PI / 180;
    };
    var R = 6371e3; // metres
    var φ1 = lat1.toRadians();
    var φ2 = lat2.toRadians();
    var Δφ = (lat2 - lat1).toRadians();
    var Δλ = (lon2 - lon1).toRadians();

    var a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    //if (d > distance) return false;
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
    return (
      <MapView
        showsUserLocation
        followsUserLocation
        toolbarEnabled
        provider={MapView.PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        region={this.state.region}>
        {this.props.phototags &&
          this.props.phototags.map((marker, i) => (
            <MapView.Marker
              key={i}
              coordinate={{
                latitude: marker.locationLat,
                longitude: marker.locationLong,
              }}
              title={marker.description}>
              <MapView.Callout tooltip onPress={this.goToPhototags.bind(this, marker)}>
                <MarkerTag phototag={marker} />
              </MapView.Callout>
            </MapView.Marker>
          ))}
      </MapView>
    );
  }
}

export default connect(mapStateToProps)(MapScreen);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    flex: 1,
    padding: 1,
    alignItems: 'center',
  },
  descriptionText: {
    marginTop: 10,
    marginBottom: 20,
  },
});
