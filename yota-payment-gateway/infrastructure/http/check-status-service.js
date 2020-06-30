const fetch =  require('node-fetch');

const ERRORS = require('../../common/constants').ERRORS;

const CHECK_STATUS_ENDPOINT = `http://${(process.env.YOTA_STATUS_CHECK_HOST || 'localhost')}:3000/check`;

class CheckStatusService {
    async check(msisdn) {
        const checkStatusUrl = `${CHECK_STATUS_ENDPOINT}/${msisdn}`;
        const statusResp = await fetch(checkStatusUrl);
        const statusRespJson = await statusResp.json();

        if(statusRespJson.statusCode && statusRespJson.statusCode == 404) {
            throw ERRORS.NO_MSISDN_FOUND;
        }

        return statusRespJson;
    }
}

module.exports = new CheckStatusService();