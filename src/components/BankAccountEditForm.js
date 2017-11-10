import React from 'react';
import {observable, computed} from 'mobx';
import {inject, observer} from "mobx-react";

const NUMERIC_STRING = /^\d*$/;

/**
 * User bank account edit form component.
 * Just send updated account to server and rerender Bankdetails.
 * Can be rewrited for update stored accounts if it's needed.
 */
@inject('store')
@observer
class BankAccountEditForm extends React.Component {
  // Immutable field - observing not required
  accountId;
  userId;

  @observable
  currencyId;
  @observable
  name;
  @observable
  account;
  @observable
  iban;
  @observable
  sortCode1;
  @observable
  sortCode2;
  @observable
  sortCode3;
  @observable
  swift;

  @computed
  get sortCode() {
    return `${this.sortCode1}-${this.sortCode2}-${this.sortCode3}`;
  }

  componentWillMount() {
    const store = this.props.store;
    const account = store.bankdetails.accounts.find(account => account._id === store.view.editAccountId);

    this.accountId = account._id;
    this.userId = account.userId;
    this.currencyId = account.currencyId;
    this.name = account.name;
    this.account = account.account;
    this.iban = account.iban;
    const sortCode = account.sortCode.split('-');
    this.sortCode1 = sortCode[0];
    // TODO: check sort code length
    this.sortCode2 = sortCode[1];
    this.sortCode3 = sortCode[2];
    this.swift = account.swift;
  }

  // Validation example
  handleAccountChange = (event) => {
    const account = event.target.value;
    if (account.match(NUMERIC_STRING)) {
      this.account = account;
    }
  };

  save = () => {
    const store = this.props.store;

    // Build JS-object for sending to server as JSON
    const account = {
      "_id": this.accountId,
      "account": this.account,
      "currencyId": this.currencyId,
      "iban": this.iban,
      "name": this.name,
      "sortCode": this.sortCode,
      "swift": this.swift,
      "userId": this.userId
    };

    store.pleasepayService.updateBankdetails(account).then((response) => {
        store.view.setDisplay('bankdetails');
    }).catch((error) => {
        store.setError(error);
    });

  }

  render() {
    return (
      <div className="accountEditForm">
        <header>Account edit form</header>
        <label>Currency</label>
        <select value={this.currencyId}
                onChange={(event) => {this.currencyId = event.target.value;}}>
          {this.props.store.currencies.map((currency) => {
           return (<option key={currency._id} value={currency._id}>{currency.translations[this.props.store.translation]}</option>);
          })}
        </select>
        <label>Name</label>
        <input type="text"
               value={this.name}
               onChange={(event) => this.name = event.target.value}/>
        <label>Account</label>
        <input type="text"
               value={this.account}
               onChange={this.handleAccountChange}/>
        <label>IBAN</label>
        <input type="text"
               value={this.iban}
               onChange={(event) => this.iban = event.target.value}/>
        <label>Sort code</label>
        <input type="text"
               value={this.sortCode1}
               onChange={(event) => this.sortCode1 = event.target.value} className="sortCode"/>
        <input type="text"
               value={this.sortCode2}
               onChange={(event) => this.sortCode2 = event.target.value} className="sortCode"/>
        <input type="text"
               value={this.sortCode3}
               onChange={(event) => this.sortCode3 = event.target.value} className="sortCode"/>
        <br/>
        <label className="swift">SWIFT</label>
        <input type="text"
               value={this.swift}
               onChange={(event) => this.swift = event.target.value}/>
        <button type="button" onClick={this.save}>Save</button>
      </div>
    );
  }
}

export default BankAccountEditForm;