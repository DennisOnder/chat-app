import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {

  constructor() {
    super();
    this.state = {
      userInput: '',
      passwordInput: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  };

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit() {
    const user = {
      username: this.state.userInput,
      password: this.state.passwordInput
    };
    axios.post('/api/users/login', user)
      .then(res => {
        localStorage.setItem('jwtToken', res.data.token);
        console.log(localStorage.jwtToken);
      })
      .catch(err => console.log(err))
  };

  render() {
    return (
      <div>
        <div id="Title">
          <h1>ChatApp</h1>
          <p>...where you can chat away.</p>
        </div>
        <div id="InputWrapper">
          <input className="inputs" type="text" name="userInput" id="UsernameInput" placeholder="Username:" value={this.state.userInput} onChange={this.onChange}/>
          <input className="inputs" type="text" name="passwordInput" id="PasswordInput" placeholder="Password:" value={this.state.passwordInput} onChange={this.onChange}/>
          <button id="SubmitButton" onClick={this.onSubmit}>Log In</button>
        </div>
      </div>
    );
  };
};

export default Login;
