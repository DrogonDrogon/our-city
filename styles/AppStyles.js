import { StyleSheet, Image } from 'react-native';

//GLOBAL COLORS
const dark = '#eee';
//-----------

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

  iconStyle: {
    backgroundColor: '#FBF8F5',
  },
  descriptionInput: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 10,
  },
  imageBackground: {
    flex: 1,
  },

//GLOBAL STYLES  
  container: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 0,
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '80%',
  },
  descriptionText: {
    marginTop: 10,
    width: 200,
  },
  imageStyle: {
    flex: 1,
    width: 200,
    height: 200,
    resizeMode: Image.resizeMode.contain,
    backgroundColor: '#fff',
  },
  iconBadgeStyle: {
    width: 30,
    height: 30,
    backgroundColor: '#ff0000',
  },
  iconBadgeMain: {
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    margin: 6,
    borderRadius: 25,
  },
  hashtag: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default AppStyles;
