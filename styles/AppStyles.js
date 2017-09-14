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
    // backgroundColor: '#FBF8F5', // light bg color
  },
  titleText: {
    textAlign: 'center',
    alignItems: 'center',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  commentInput: {
    backgroundColor: '#fff',
    padding: 10,
    width: '80%',
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
  descriptionContainerView: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
  },
  descriptionContainerText: {
    fontSize: 18,
  },
  authorContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 10,
    width: '95%',
  },
  authorNameText: {
    fontWeight: 'bold',
    marginRight: 10,
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
    width: '95%',
    backgroundColor: '#fff',
    padding: 10,
  },
  horizontalDisplay: {
    flex: 1,
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalDisplayNoSpace: {
    flex: 1,
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentView: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#fff',
    width: '80%',
    padding: 10,
    justifyContent: 'center',
  },
  columnContainer: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  nameText: {
    fontSize: 16,
    marginRight: 10,
    flexWrap: 'wrap',
  },
  dateText: {
    fontSize: 12,
    marginRight: 10,
  },
  commentText: {
    fontSize: 16,
    marginTop: 5,
    flexWrap: 'wrap',
  },
  touchableDelete: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default AppStyles;
