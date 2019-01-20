import React, { Component } from 'react';

export default class Home extends Component {

  state = {
    name: 'liao1', //
  };

  render() {
    return (
      <div>
        this is home!!!!!~{this.state.name}~~是的~!
        <p>124444443</p>
      </div>
    );
  }
}
