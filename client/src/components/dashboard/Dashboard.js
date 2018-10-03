import React, { Component } from 'react';
import axios from 'axios';

class Dashboard extends Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      messageInput: ''
    };
    this.fetchMessages = this.fetchMessages.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  };

  componentDidMount = () => {
    this.fetchMessages();
  };

  fetchMessages() {
    axios.get('/api/messages')
      .then(res => this.setState({ messages: res.data }))
      .catch(err => console.log(err));
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit() {
    const newMessage = this.state.messageInput;
    axios.defaults.headers.common['Authorization'] = localStorage.jwtToken;
    axios.post('/api/messages', newMessage)
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div id="Dashboard">
        <div id="MessageInputWrapper">
          <input name="messageInput" type="text" id="MessageInput" placeholder="What's on your mind?" value={this.state.messageInput} onChange={this.onChange}/>
          <button id="MessageSubmitButton" onClick={this.onSubmit}>Send</button>
        </div>
        <div id="Output">
          {
            this.state.messages.length > 0 
              ?
            this.state.messages.map((message, index) => {
              return (
                <div key={index}>
                  <p>{message.message}</p>
                  <p>
                    <b>{message.user}</b>
                  </p>
                </div>
              )
            })
              :
            <div>
              <p>No Messages</p>
            </div>
          }
        </div>
      </div>
    );
  };
};

export default Dashboard;
