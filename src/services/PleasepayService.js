import request from './PleasepayRequest';

/**
 * Pleasepay API client
 */
class PleasepayService {
  constructor(url, token) {
    this.url = url;
    this.token = token;
  }

  setToken(token) {
    this.token = token;
    console.log(`New token: ${this.token}`);
  }

  async auth(email, password) {
    const response = await request.post(`${this.url}/auth`, null, {"email": email, "password": password});
    if ("token" in response) {
      this.setToken(response.token);
    }
    else {
      throw 'Authenticated without error, but token not returned';
    }
  }

  async loadCurrencies() {
    const response = await request.get(`${this.url}/currencies`);
    return response.items;
  }

  async createBankdetails(bankAccount) {
    const response = await request.post(`${this.url}/bankdetails`, this.token, bankAccount);
    return response;
  }

  async loadBankdetails() {
    const response = await request.get(`${this.url}/bankdetails`, this.token);
    return response.items;
  }

  async updateBankdetails(bankAccount) {
    const response = await request.put(`${this.url}/bankdetails`, this.token, bankAccount);
    return response;
  }
}

export default PleasepayService;