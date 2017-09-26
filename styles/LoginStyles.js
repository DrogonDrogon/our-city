import { StyleSheet } from 'react-native';

const facebookBlueColor = '#3B5699';
const primaryGreen = '#34A853';

const LoginStyles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: 'column',
    paddingTop: 70,
  },
  title: {
    color: 'white',
    fontSize: 50,
    textAlign: 'center',
  },
  signupLink: {
    color: 'lightblue',
    fontSize: 12,
  },
  alignRight: {
    alignSelf: 'flex-end',
  },
  textInput: {
    height: 40,
    fontSize: 16,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
  },
  transparentButton: {
    marginTop: 30,
    borderColor: facebookBlueColor,
    borderWidth: 2,
  },
  buttonBlueText: {
    fontSize: 16,
    color: facebookBlueColor,
  },
  buttonWhiteText: {
    fontSize: 16,
    color: 'white',
  },
  buttonBigText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonBlackText: {
    fontSize: 20,
    color: '#595856',
  },
  primaryColor: {
    backgroundColor: primaryGreen,
  },
  facebookColor: {
    backgroundColor: facebookBlueColor,
  },
  standardButtonSize: {
    height: 50,
    borderRadius: 5,
  },
  footer: {
    marginTop: 100,
  },
});

export default LoginStyles;
