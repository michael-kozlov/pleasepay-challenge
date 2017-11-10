import {observable, action, runInAction} from 'mobx';

/**
 * Store for save current view state
 */
class ViewStore {
  root;

  @observable
  display = 'bankdetails';
  @observable
  editAccountId;

  @action
  setDisplay(display) {
    this.display = display;
  }

  // Unused setter, writed for future.
  @action
  setEditAccountId(accountId) {
    this.editAccountId = accountId;
  }

  @action
  editAccount(accountId) {
    this.setEditAccountId(accountId);
    this.setDisplay('bankaccounteditform');
  }

  constructor(root) {
    this.root = root;
  }
}

export default ViewStore;