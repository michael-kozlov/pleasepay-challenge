import React from 'react';
import {inject, observer} from 'mobx-react';

@inject('store')
@observer
class ErrorDialog extends React.Component {
  render() {
    return (
      <div>
        <header>Error occured</header>
        Error message:<br/>
        {this.props.store.errorMessage}
        <br/><br/>
        Please reload page and try again.
      </div>);
  }
}

export default ErrorDialog;