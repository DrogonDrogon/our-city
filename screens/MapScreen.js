import React from 'react';
import { MapView } from 'expo';
import * as firebase from 'firebase';

export default class MapScreen extends React.Component {
  state = {
    markers: [],
  };
  componentWillMount() {
    firebase.database().ref('/photoTags/').once('value').then(photoTags => {
      let dataArray = [];
      for (var key in photoTags.val()) {
        console.log(key);
        dataArray.push(photoTags.val()[key]);
      }

      this.setState({ markers: dataArray }, () => {
        console.log('now', this.state.markers[0]);
      });
    });
  }

  render() {
    return (
      <MapView
        provider={MapView.PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 40.750355960509054,
          longitude: -73.97669815393424,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {this.state.markers.map((marker, i) =>
          <MapView.Marker
            key={i}
            coordinate={{
              latitude: marker.location.coords.latitude,
              longitude: marker.location.coords.longitude,
            }}
            title={marker.description}
          />
        )}
      </MapView>
    );
  }
}
