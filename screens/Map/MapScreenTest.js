import React from 'react';
import { MapView, Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import { Text, Image, StyleSheet, View, Modal, ScrollView, TouchableHighlight } from 'react-native';
import db from '../../db';
import MarkerTag from '../../components/markerTag';
import FilterScreen from './FilterScreen';

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
    modalVisible: false,
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

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View>
        <View style={{ width: '100%', height: '90%' }}>
          <MapView
            showsUserLocation
            followsUserLocation
            toolbarEnabled
            provider={MapView.PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            region={this.state.region}>
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
        </View>
        <View style={{marginTop: 22}}>
          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {alert("Modal has been closed.")}}
            >
           <View style={{marginTop: 22}}>
            
            <View>
              <TouchableHighlight onPress={() => {
                this.setModalVisible(!this.state.modalVisible)
              }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
              <FilterScreen/>
            </View>
           </View>
          </Modal>

          <TouchableHighlight style={{zIndex: 2, marginBottom:50, backgroundColor: 'black'}} onPress={() => {
            this.setModalVisible(true)
          }}>
            <Text>Show Modal</Text>
          </TouchableHighlight>

        </View>
      </View>
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
