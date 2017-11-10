require('es6-promise').polyfill();
require('isomorphic-fetch');

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

/**
 * Fetch wrapper for processing error response
 * and easier use base HTTP-methods.
 */
class PleasepayRequest {
  buildOptions(headers, method, body) {
    const options = {headers: headers, method: method};
    return body != null ? {...options, body: JSON.stringify(body)} : options;
  }


  async request(url, headers, method, body) {
    const response = await fetch(url, this.buildOptions(headers, method, body));
    const responseBody = await response.json();

    if ("error" in responseBody) {
      const error = responseBody.error.pop();

      if ("messages" in error) {
        throw error.messages.reduce(function (messages, message) {
          return (messages != null && messages.length > 0) ? messages.concat('\n', message) : message;
        });
      }

      throw 'unknown error without message';
    }

    return responseBody;
  };

  async get(url, token) {
    return this.request(url, token != null ? {...headers, "AUTH-HEADER": token} : headers, 'GET');
  }

  async post(url, token, body) {
    return this.request(url, token != null ? {...headers, "AUTH-HEADER": token} : headers, 'POST', body);
  }

  async put(url, token, body) {
    return this.request(url, token != null ? {...headers, "AUTH-HEADER": token} : headers, 'PUT', body);
  }
}

export default new PleasepayRequest();