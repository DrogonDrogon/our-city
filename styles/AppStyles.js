import { StyleSheet, Image } from 'react-native';

const AppStyles = StyleSheet.create({
  splash: {
    height: '100%',
    width: '100%',
  },
  scrollViewContainer: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 50,
    backgroundColor: '#FBF8F5',
  },
  titleText: {
    textAlign: 'center',
    fontSize: 20,
    alignItems: 'center',
  },
  commentInput: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 10,
  },
  photoDisplayContainer: {
    width: '100%',
    height: 250,
    marginBottom: 20,
  },
  phototagImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textDisplayPadding: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  authorContainer: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginBottom: 10,
    width: '80%',
  },
  imageSetting: {
    height: 40,
    width: 40,
    marginRight: 10,
    borderRadius: 20,
  },
  hashtag: {
    color: 'blue',
    fontWeight: 'bold',
  },
  iconStyle: {
    backgroundColor: '#FBF8F5',
  },
  descriptionInput: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 10,
  },
});

export default AppStyles;
