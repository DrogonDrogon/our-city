import { Location, Permissions } from 'expo';
import { SET_LOCATION } from './constants';

export const getLocationAsync = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    return {
      type: SET_LOCATION,
      location: { error: 'Location permissions not disabled. Please enable in app settings.' },
    };
  } else {
    let location = await Location.getCurrentPositionAsync();
    return {
      type: SET_LOCATION,
      location: { latitude: location.coords.latitude, longitude: location.coords.longitude },
    };
  }
};
