import React from "react";
import Firebase from "../Firebase";
import { withFirebase } from "../Firebase";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      articles: [],
      isLoggedIn: props.isLoggedIn,
      show: false
    };
    this.FirebaseIntance = new Firebase();
  }

  logout = () => {
    this.props.logout();
  };

  componentDidMount() {
    this.FirebaseIntance.articles().on("value", snapshot => {
      const articlesObject = snapshot.val();
      if (articlesObject) {
        const articlesList = Object.keys(articlesObject).map(key => ({
          ...articlesObject[key],
          uid: key
        }));
        this.setState({
          articles: articlesList,
          loading: false
        });
      }
    });
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <button
              className="btn btn-primary"
              onClick={() => {
                window.location.replace("/new");
              }}
            >
              Add a new article
            </button>
          </div>
          <br />
          <br />
          {this.state.articles.map(x => (
            <div key={x.uid} className="row">
              <div className="panel panel-primary">
                <div className="panel-heading">{x.title}</div>
                <div className="panel-body">{x.content}</div>
                <div className="panel-footer">
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      window.location.replace("/new/" + x.uid);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    style={{ marginLeft: "10px" }}
                    className="btn btn-danger"
                    onClick={() => {
                      this.FirebaseIntance.article(x.uid).remove();
                    }}
                  >
                    Delete
                  </button>
                  {/* {x.lastEdit && (
                    <span style={{ marginLeft: "10px" }}>
                      Last edit: {x.lastEdit}
                    </span>
                  )}
                  {x.createdAt && (
                    <span style={{ marginLeft: "10px" }}>
                      Created at: {x.createdAt}
                    </span>
                  )} */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withFirebase(Home);
