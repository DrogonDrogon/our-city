import React from 'react';
import { MapView } from 'expo';
import db from '../db';

export default class MapScreen extends React.Component {
  state = {
    markers: [],
  };
  componentWillMount() {
    db.child('phototags').once('value').then(photoTags => {
      let dataArray = [];
      for (var key in photoTags.val()) {
        dataArray.push(photoTags.val()[key]);
      }
      this.setState({ markers: dataArray }, () => {
        // console.log('[MapScreen] data', this.state.markers);
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
              latitude: marker.locationLat,
              longitude: marker.locationLong,
            }}
            title={marker.description}
          />
        )}
      </MapView>
    );
  }
}
