import {observable, action, runInAction} from 'mobx';

/**
 * Store for save user's bank accounts.
 * No methods to update stored account - accounts
 * reloaded on every Bankdetails component remounting.
 */
class BankdetailsStore {
  root;

  @observable
  accounts = [];

  constructor(root) {
    this.root = root;
  }

  @action
  async loadAccounts() {
    try {
      const accounts = await this.root.pleasepayService.loadBankdetails();
      runInAction(() => {
        this.accounts = accounts;
      });
    }
    catch (error) {
      this.root.setError(`Server return error on load bank accounts: ${error}`);
    }
  }
}

export default BankdetailsStore;