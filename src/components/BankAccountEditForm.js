import React from 'react';
import {observable, computed, action} from 'mobx';
import {inject, observer} from "mobx-react";

const NUMERIC_STRING = /^\d*$/;
const ENTER_KEY = 13;

/**
 * User bank account edit form component.
 * Just send updated account to server and rerender Bankdetails.
 * Can be rewrited for update stored accounts if it's needed.
 */
@inject('store')
@observer
class BankAccountEditForm extends React.Component {
  // Data fields for store refs to form elements
  nameInput;
  accountInput;
  ibanInput;
  sortCode1Input;
  sortCode2Input;
  sortCode3Input;
  swiftInput;

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

  @observable
  errorMessage;

  @action
  setErrorMessage(errorMessage) {
    this.errorMessage = errorMessage;
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

  isNumericString(text) {
    return text.match(NUMERIC_STRING);
  }

  handleAccountChange = (event) => {
    const account = event.target.value;
    if (this.isNumericString(account)) {
      this.account = account;
    }
  };

  isValidSortCode = (sortCode) => {
    return this.isNumericString(sortCode) && sortCode.length <= 2;
  }

  focusToNext = (sortCode) => {
    return sortCode.length == 2;
  }

  handleSortCode1Change = (event) => {
    const sortCode = event.target.value;
    if (this.isValidSortCode(sortCode)) {
      this.sortCode1 = sortCode;

      if (this.focusToNext(sortCode)) {
        this.sortCode2Input.focus();
      }
    }
  }

  handleSortCode2Change = (event) => {
    const sortCode = event.target.value;
    if (this.isValidSortCode(sortCode)) {
      this.sortCode2 = sortCode;

      if (this.focusToNext(sortCode)) {
        this.sortCode3Input.focus();
      }
    }
  }

  handleSortCode3Change = (event) => {
    const sortCode = event.target.value;
    if (this.isValidSortCode(sortCode)) {
      this.sortCode3 = sortCode;

      if (this.focusToNext(sortCode)) {
        this.swiftInput.focus();
      }
    }
  }

  handleIbanChange = (event) => {
    const iban = event.target.value.replace(/\ /g, '').toUpperCase();

    if (!iban.match(/^[A-Z0-9]{0,34}$/)) {
      return;
    }

    const ibanParts = iban.match(/.{1,4}/g);

    if (ibanParts) {
      this.iban = iban.match(/.{1,4}/g).join(' ');
    }
    else {
      this.iban = '';
    }
  }

  handleSwiftChange = (event) => {
    const swift = event.target.value.toUpperCase();

    if (!swift.match(/^[A-Z0-9]{0,11}$/)) {
      return;
    }

    this.swift = swift;
  }

  isValid = () => {
    let valid = true;
    let wrongFields = [];

    if (!this.currencyId) {
      wrongFields.push('currency');
      valid = false;
    }

    if (!this.name || this.name.length == 0) {
      wrongFields.push('name');
      valid = false;
    }

    if (!this.account || this.account.length == 0) {
      wrongFields.push('name');
      valid = false;
    }

    if (!this.iban || this.iban.length == 0) {
      wrongFields.push('iban');
      valid = false;
    }

    if (this.sortCode.length < 8) {
      wrongFields.push('sort code');
      valid = false;
    }

    if (!this.swift || this.swift.length < 8) {
      wrongFields.push('swift');
      valid = false;
    }

    if(!valid) {
      console.log(34);
      const errorMessage = 'Enter valid ' + wrongFields.join(', ') + ' before save';
      this.setErrorMessage(errorMessage);
      console.log(errorMessage);
    }

    return valid;
  }

  cancel = () => {
    const store = this.props.store;
    store.view.setDisplay('bankdetails');
    store.view.setEditAccountId(null);
  }

  save = () => {
    if (!this.isValid()) {
      return;
    }

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
      this.cancel();
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
                onChange={(event) => {
                  this.currencyId = event.target.value;
                  this.nameInput.focus();
                }}>
          {this.props.store.currencies.map((currency) => {
           return (<option key={currency._id} value={currency._id}>{currency.translations[this.props.store.translation]}</option>);
          })}
        </select>
        <label>Name</label>
        <input type="text"
               value={this.name}
               ref={(element) => {this.nameInput = element;}}
               onChange={(event) => this.name = event.target.value}
               onKeyDown={(event) => {if (event.which === ENTER_KEY) {this.accountInput.focus()}}}/>
        <label>Account</label>
        <input type="text"
               value={this.account}
               ref={(element) => {this.accountInput = element;}}
               onChange={this.handleAccountChange}
               onKeyDown={(event) => {if (event.which === ENTER_KEY) {this.ibanInput.focus()}}}/>
        <label>IBAN</label>
        <input type="text"
               value={this.iban}
               ref={(element) => {this.ibanInput = element;}}
               onChange={this.handleIbanChange}
               onKeyDown={(event) => {if (event.which === ENTER_KEY) {this.sortCode1Input.focus()}}}/>
        <label>Sort code</label>
        <input type="text"
               value={this.sortCode1}
               ref={(element) => {this.sortCode1Input = element;}}
               onChange={this.handleSortCode1Change} className="sortCode"
               onKeyDown={(event) => {if (event.which === ENTER_KEY) {this.sortCode2Input.focus()}}}/>
        <input type="text"
               value={this.sortCode2}
               ref={(element) => {this.sortCode2Input = element;}}
               onChange={this.handleSortCode2Change} className="sortCode"
               onKeyDown={(event) => {if (event.which === ENTER_KEY) {this.sortCode3Input.focus()}}}/>
        <input type="text"
               value={this.sortCode3}
               ref={(element) => {this.sortCode3Input = element;}}
               onChange={this.handleSortCode3Change} className="sortCode"
               onKeyDown={(event) => {if (event.which === ENTER_KEY) {this.swiftInput.focus()}}}/>
        <label className="swift">SWIFT</label>
        <input type="text"
               value={this.swift}
               ref={(element) => {this.swiftInput = element;}}
               onChange={this.handleSwiftChange}/>
        <div className="editFormErrorMessage">{this.errorMessage}</div>
        <button type="button" onClick={this.cancel}>Cancel</button>
        <button type="button" onClick={this.save}>Save</button>
      </div>
    );
  }
}

export default BankAccountEditForm;