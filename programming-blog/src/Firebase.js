import app from 'firebase/app';
import FirebaseContext, { withFirebase } from 'react-redux-firebase';
import 'firebase/database';
const config = {
    apiKey: "AIzaSyDM3KyVUd_G-Mwyg8YkwNzSrOxy1BKYlY8",
    authDomain: "programming-blog-4871f.firebaseapp.com",
    databaseURL: "https://programming-blog-4871f.firebaseio.com",
    projectId: "programming-blog-4871f",
    storageBucket: "programming-blog-4871f.appspot.com",
    messagingSenderId: "243981022782",
    appId: "1:243981022782:web:3e74ddcf82cc0dd169c36f",
    measurementId: "G-9G899Z7026"
};
class Firebase {
  constructor() {
    app.initializeApp(config);
    this.db = app.database();
  }

  article = uid => this.db.ref(`articles/${uid}`);
  articles = () => this.db.ref('articles');
}
export default Firebase;

export { FirebaseContext, withFirebase };