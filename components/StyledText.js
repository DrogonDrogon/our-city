import React from 'react';
import { Text } from 'react-native';
import AppStyles from '../styles/AppStyles';

export class MonoText extends React.Component {
  render() {
    return (
      <Text
        {...this.props}
        style={[this.props.style, { fontFamily: 'space-mono' }]}
      />
    );
  }
}
