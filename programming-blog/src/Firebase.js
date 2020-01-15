import app from 'firebase/app';
import FirebaseContext, { withFirebase } from 'react-redux-firebase';
import 'firebase/database';
const config = {

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