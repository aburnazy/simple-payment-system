const fetch = require('node-fetch');
const StatusError = require('../../application/errors/StatusError');
const { ERRORS } = require('../../common/constants');

const HOST = process.env.YOTA_STATUS_CHECK_HOST || 'localhost';
const CHECK_STATUS_ENDPOINT = `http://${HOST}:3000/check`;

class CheckStatusService {
  static async check(msisdn) {
    const checkStatusUrl = `${CHECK_STATUS_ENDPOINT}/${msisdn}`;
    const statusResp = await fetch(checkStatusUrl);
    const statusRespJson = await statusResp.json();

    if (statusRespJson.statusCode && statusRespJson.statusCode === 404) {
      throw new StatusError(ERRORS.NO_MSISDN_FOUND);
    }

    return statusRespJson;
  }
}

module.exports = CheckStatusService;
