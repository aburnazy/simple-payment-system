const Constants = {
  ERRORS: {
    REQUIRED_FIELD_MISSING: {
      code: 1,
      statusCode: 400,
      message: 'Required field is missing',
    },
    INVALID_MSISDN: {
      code: 2,
      statusCode: 400,
      message: 'Provided MSISDN number is not valid',
    },
    NO_MSISDN_FOUND: {
      code: 3,
      statusCode: 404,
      message: 'No customers were found with this MSISDN',
    },
    INVALID_DATE: {
      code: 4,
      statusCode: 400,
      message:
        'The payment date should be specified in milliseconds and not be in the future',
    },
    INVALID_OPERATION_CODE: {
      code: 5,
      statusCode: 400,
      message:
        'Invalid operationCode. Supported codes are 1 (Payment) and 2 (Withdrawal)',
    },
    INSUFFICIENT_FUNDS: {
      code: 6,
      statusCode: 402,
      message:
        'Insufficient funds for the withdrawal. Need to refill the account',
    },
    INVALID_PAYMENT_AMOUNT: {
      code: 7,
      statusCode: 400,
      message: 'Payment amount is invalid.',
    },
    INTERNAL_ERROR: {
      code: 8,
      statusCode: 500,
      message: 'An internal error occurred. Please try again later.',
    },
  },

  OPERATION_CODE: {
    PAYMENT: 1,
    WITHDRAWAL: 2,
  },
};

module.exports = Constants;
