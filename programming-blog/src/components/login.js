import React from "react";
import Axios from "axios";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    Axios.defaults.baseURL = "https://salty-sands-74195.herokuapp.com/";
  }

  login = () => {
    const user = {
      email: this.state.email,
      password: this.state.password
    };
    Axios.post("user/login", user).then(response => {
      localStorage.setItem("Token", response.data.token);
      localStorage.setItem("Name", response.data.user.name);
      console.log(response);
      this.props.login(response.data.token);
      window.location.replace('/')
    }).catch(response => {
      alert("Invalid user and password")
    });
  };

  render() {
    return (
      <div className="container">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h1>{this.props.title}</h1>
          </div>
          <div className="panel-body">
        <div className="border p-4">
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              onChange={ev => this.setState({ email: ev.target.value })}
              placeholder="Email .."
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              onChange={ev => this.setState({ password: ev.target.value })}
              placeholder="Password .."
            />
          </div>
          <button className="btn btn-primary" onClick={this.login}>
            Login
          </button>
          <button style={{ marginLeft: "10px"}} className="btn btn-primary" onClick={() => {
            window.location.replace("/register");
          }}>
            Register
          </button>
          <button style={{ marginLeft: "10px"}} className="btn btn-info" onClick={() => {
            window.location.replace("/");
          }}>
            Go back
          </button>
        </div>
      </div>
      </div>
      </div>
    );
  }
}
//const Login = () => <h1>Login</h1> //ES6 way
export default Login;
