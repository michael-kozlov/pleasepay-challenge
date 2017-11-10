import React from 'react';
import {inject, observer} from "mobx-react";

import BankAccount from './BankAccount.js';

/**
 * Component for rendering user bank account list in parent table
 */
@inject('store')
@observer
class BankAccounts extends React.Component {
  render() {
    const accounts = this.props.store.bankdetails.accounts;
    return (accounts.map(account => <BankAccount key={account._id} account={account}/>));
  }
}

export default BankAccounts;