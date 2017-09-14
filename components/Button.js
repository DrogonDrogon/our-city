import React, { Component } from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';
import AppStyles from '../styles/AppStyles';

function getContent(props) {
  if (props.children) {
    return props.children;
  }
  return <Text style={props.styles.label}>{props.label}</Text>;
}

const Button = props => {
  return (
    <TouchableHighlight
      underlayColor="#ccc"
      onPress={props.onPress}
      style={[props.noDefaultStyles ? '' : styles.button, props.styles ? props.styles.button : '']}>
      {getContent(props)}
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

export default Button;
