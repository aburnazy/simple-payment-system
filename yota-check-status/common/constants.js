module.exports = {
  ERRORS: {
    NO_CUSTOMER_FOUND: {
      code: 1,
      statusCode: 404,
      message: 'No customer was found with this MSISDN',
    },
    INTERNAL_ERROR: {
      code: 2,
      statusCode: 500,
      message: 'An internal error occurred. Please try again later.',
    },
  },
  CUSTOMER_STATUS: {
    ACTIVE: 1,
    INACTIVE: 0,
  },
};
