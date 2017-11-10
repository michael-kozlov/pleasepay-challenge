import React from 'react';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';

const ENTER_KEY = 13;

@inject('store')
@observer
class AuthenticationDialog extends React.Component {
  @observable token = "";

  render() {
    return (
      <div>
        <label>Enter your pleasepay token:</label><br/>
        <input type="text"
               size="64"
               value={this.token}
               onChange={this.handleChange}
               onKeyDown={this.handleKeyDown}
        />
      </div>);
  }

  handleChange = (event) => {
    this.token = event.target.value;
  };

  handleKeyDown = (event) => {
    if (event.which === ENTER_KEY) {
      const token = this.token.trim();
      this.props.store.setToken(token);
    }
  };
}

export default AuthenticationDialog;