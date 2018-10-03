import React, { Component } from 'react';
import '../../App.css';

class Auth extends Component {

  componentDidMount = () => {
    setTimeout(() => document.getElementById('Spinner').style.display = 'none', 3000);
  }

  redirectFromLandingPage(e) {
    if(e.target.innerHTML === 'Log In') {
      window.location.href = '/login';
    } else if(e.target.innerHTML === 'Register') {
      window.location.href = '/register';
    }
  }
  
  render() {
    return (
      <div id="Wrapper">
        <div className="lds-ring" id="Spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div id="Title">
          <h1>ChatApp</h1>
          <p>...where you can chat away.</p>
        </div>
        <div id="AuthenticationButtons">
          <button className="authBtn" onClick={this.redirectFromLandingPage}>Log In</button>
          <button className="authBtn" onClick={this.redirectFromLandingPage}>Register</button>
        </div>
      </div>
    )
  }
}

export default Auth;