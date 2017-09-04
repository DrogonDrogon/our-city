import { Location, Permissions } from 'expo';
import { SET_LOCATION } from './constants';

export const getLocationAsync = async location => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    this.setState({
      errorMessage: 'Permission to access location was denied',
    });
  }
  if (!location) {
    location = await Location.getCurrentPositionAsync({});
  }
  console.log(location);
  return {
    type: SET_LOCATION,
    location: { latitude: location.coords.latitude, longitude: location.coords.longitude },
  };
};
