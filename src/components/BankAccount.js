import React from 'react';
import {inject, observer} from "mobx-react";

/**
 * Component for rendering just one table row for one account
 */
@inject('store')
@observer
class BankAccount extends React.Component {
  render() {
    const account = this.props.account;
    const currencies = this.props.store.currencies;
    const currency = currencies.find(currency => currency._id === account.currencyId);

    return (
      <tr>
        <td>{currency.translations[this.props.store.translation]}</td>
        <td>{account.name}</td>
        <td>{account.account}</td>
        <td>{account.iban}</td>
        <td>{account.sortCode}</td>
        <td>{account.swift}</td>
        <td><button type="button" onClick={this.handleEdit}>EDIT</button></td>
      </tr>
    );
  }

  handleEdit = (event) => {
    this.props.store.view.editAccount(this.props.account._id);
  }
}

export default BankAccount;