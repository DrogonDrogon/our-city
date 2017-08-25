// Initialize Firebase
const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  databaseURL: config.firebase.databaseURL,
  storageBucket: config.firebase.storageBucket,
};

firebase.initializeApp(firebaseConfig);

export default database;