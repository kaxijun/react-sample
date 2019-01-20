import React, {Component} from 'react';

export default class Page1 extends Component {


  state = {
    name: 'liao2', //
  };

  render() {
    return (
      <div>
        <p>{this.state.name}</p>
        this is about~hi!!!!~~~~~~~~
        <p>ha~</p>
      </div>
    )
  }
}
