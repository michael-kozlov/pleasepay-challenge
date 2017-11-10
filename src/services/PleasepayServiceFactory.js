import PleasepayService from './PleasepayService.js';

/**
 * Factory for configure PleasepayService on create
 * (now just set API url)
 */
class PleasepayServiceFactory {
  getPleasepayService() {
    // TODO: read url from configuration file
    return new PleasepayService('https://api.pleasepay.co.uk');
  }
}

export default new PleasepayServiceFactory();