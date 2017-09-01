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
      latitude: 20.750355960509054,
      longitude: -73.97669815393424,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  };

  componentWillMount() {
    this.getLocation();
    Location.watchPositionAsync(location => {
      this.setLocation(location);
    });
  }

  goTophototags(marker) {
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
