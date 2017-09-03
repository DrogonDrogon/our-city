import { Location, Permissions } from 'expo';
import { SET_LOCATION } from './constants';

export const getLocationAsync = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    this.setState({
      errorMessage: 'Permission to access location was denied',
    });
  }
  let location = await Location.getCurrentPositionAsync({});
  return {
    type: SET_LOCATION,
    location,
  };
};
