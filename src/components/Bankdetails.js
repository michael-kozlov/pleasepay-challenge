import React from 'react';
import {inject, observer} from "mobx-react";

import BankAccounts from './BankAccounts.js';

/**
 * Root component to show user bank accounts table,
 * directly render table header, and render accounts
 * list with BankAccounts component.
 */
@inject('store')
@observer
class Bankdetails extends React.Component {
  componentDidMount() {
    this.props.store.bankdetails.loadAccounts();
  }

  render() {
    return (
      <div className="bankdetails">
        <header>Bankdetails</header>
        <table className="bankdetails">
          <thead>
            <tr>
              <th>Currency</th>
              <th>Name</th>
              <th>Account</th>
              <th>IBAN</th>
              <th>Sort code</th>
              <th>SWIFT</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <BankAccounts/>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Bankdetails;