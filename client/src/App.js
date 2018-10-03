import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Auth from './components/auth/Auth';
import setAuthToken from './utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import Login from './components/login/Login';
import Register from './components/register/Register';

class App extends Component {

  componentDidMount = () => {
    if(localStorage.jwtToken) {
      setAuthToken(localStorage.jwtToken);
      const decoded = jwt_decode(localStorage.jwtToken);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        window.location.href = '/login';
        this.setState({
          user: {}
        })
      }
    }
  }

  constructor() {
    super();
    this.state = {
      user: {}
    }
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Auth}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/register" component={Register}/>
        </div>
      </Router>
    );
  }
}

export default App;
