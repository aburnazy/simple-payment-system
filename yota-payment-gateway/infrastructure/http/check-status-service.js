const { get } = require('lodash');
const axios = require('axios');
const StatusError = require('../../application/errors/StatusError');
const { ERRORS } = require('../../common/constants');
const config = require('../../app.config');

const CHECK_STATUS_ENDPOINT = `http://${config.checkStatusHost}:${config.checkStatusPort}/check`;

class CheckStatusService {
  static async check(msisdn) {
    let response;
    try {
      response = await axios.get(`${CHECK_STATUS_ENDPOINT}/${msisdn}`);
    } catch (err) {
      const status = get(err, 'response.status');
      if (status === 404) {
        throw new StatusError(ERRORS.NO_MSISDN_FOUND);
      }
      throw new StatusError(ERRORS.INTERNAL_ERROR);
    }

    return response.data;
  }
}

module.exports = CheckStatusService;
