import {observable, action, runInAction, reaction} from 'mobx';

import BankdetailsStore from './BankdetailsStore.js';
import ViewStore from './ViewStore.js';
import PleasepayServiceFactory from '../services/PleasepayServiceFactory.js';

/**
 * Common application store - save information about application state, error,
 * available currencies, translation, etc.
 * Provide access to specific stores (view, bankdetails) and pleasepay service.
 */
class PleasepayStore {
  pleasepayService;
  bankdetails;
  view;

  @observable
  state = 'unauthenticated';
  @observable
  token;
  @observable
  errorMessage;

  // Currencies and translation are fixed now. Observable annotation writed for future.
  @observable
  currencies;
  @observable
  translation = 'en';

  @action
  setState(state) {
    this.state = state;
  }

  @action
  setError(errorMessage) {
    console.log(errorMessage);
    this.errorMessage = errorMessage;
    this.setState('error');
  }

  @action
  setToken(token) {
    this.token = token;
    this.setState('authenticated');
  }

  registerTokenCopyingOnChange() {
    reaction(
      () => this.token,
      token => this.pleasepayService.setToken(token)
    );
  }

  constructor() {
    this.bankdetails = new BankdetailsStore(this);
    this.view = new ViewStore(this);
    this.pleasepayService = PleasepayServiceFactory.getPleasepayService();
    this.registerTokenCopyingOnChange();
  }

  @action
  async loadCurrencies() {
    try {
      const currencies = await this.pleasepayService.loadCurrencies();
      runInAction(() => {
        this.currencies = currencies;
      });
    }
    catch (error) {
      this.setError(`Server return error on loading currencies: ${error}`);
    }
  }
}

export default PleasepayStore;