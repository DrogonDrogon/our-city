import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

export default LoginStyles = StyleSheet.create({
  scroll: {
    backgroundColor: '#E1D7D8',
    padding: 30,
    flexDirection: 'column',
  },
  label: {
    color: '#0d8898',
    fontSize: 20,
  },
  alignRight: {
    alignSelf: 'flex-end',
  },
  textInput: {
    height: 80,
    fontSize: 30,
    backgroundColor: '#FFF',
  },
  transparentButton: {
    marginTop: 30,
    borderColor: '#3B5699',
    borderWidth: 2,
  },
  buttonBlueText: {
    fontSize: 20,
    color: '#3B5699',
  },
  buttonBigText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inline: {
    flexDirection: 'row',
  },
  buttonWhiteText: {
    fontSize: 20,
    color: '#FFF',
  },
  buttonBlackText: {
    fontSize: 20,
    color: '#595856',
  },
  primaryButton: {
    backgroundColor: '#34A853',
  },
  footer: {
    marginTop: 100,
  },
});