import React from "react";
import "./App.css";
import Login from "./components/login";
import Register from "./components/register";
import Home from "./components/home";
import NewArticle from "./components/NewArticle";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false
    };
  }

  login = token => {
    if (localStorage.getItem("Token") == token) {
      this.setState({
        isLoggedIn: true
      });
    }
  };

  logout = () => {
    localStorage.setItem("Token", "");
    localStorage.setItem("Name", "");
    this.setState({
      isLoggedIn: false
    });
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login">
            <Login login={this.login} title="Login" />
          </Route>
          <Route path="/register">
            <Register title="Register" />
          </Route>
          <Route
            path="/new/:id"
            render={props => (
              <NewArticle title="Edit article" action="Edit" {...props} />
            )}
          />
          <Route path="/new">
            <NewArticle title="Add a new article" action="Add" />
          </Route>
          <Route
            path="/"
            render={() => (
              <Home
                isLoggedIn={this.state.isLoggedIn}
                logout={this.logout}
                title="Home"
              />
            )}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
