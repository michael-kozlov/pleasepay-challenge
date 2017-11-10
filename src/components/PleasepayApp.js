import React from 'react';
import {inject, observer} from 'mobx-react';

import ErrorDialog from './ErrorDialog.js'
import AuthenticationDialog from './AuthenticationDialog.js'
import Bankdetails from './Bankdetails.js'
import BankAccountEditForm from './BankAccountEditForm.js';

/**
 * Main application component - track app state,
 * render specified pages.
 */
@inject('store')
@observer
class PleasepayApp extends React.Component {
  componentDidMount() {
    this.props.store.loadCurrencies();
  }

  showDisplay() {
    const store = this.props.store;
    let view;

    switch (store.view.display) {
      case 'bankdetails': {
        view = <Bankdetails/>;
        break;
      }
      // TODO: BankAccountEditForm rendering can be removed to Bankdetails
      case 'bankaccounteditform': {
        view = <BankAccountEditForm/>;
        break;
      }
      default: {
        store.setError(`Unknown display: ${store.display}`);
        view = <div></div>;
      }
    }

    return view;
  }

  render() {
    const store = this.props.store;
    let view;

    switch (store.state) {
      case 'error': {
        view = <ErrorDialog/>;
        break;
      }
      case 'unauthenticated': {
        view = <AuthenticationDialog/>;
        break;
      }
      case 'authenticated': {
        view = this.showDisplay();
        break;
      }
      default: {
        // Throws warning into console...
        // TODO: rewrite
        store.setError(`Unknown state: ${store.state}`);
        view = <div></div>;
      }
    }

    return view;
  }
}

export default PleasepayApp;