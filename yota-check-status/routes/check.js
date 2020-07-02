const router = require('express').Router();
const oracledb = require('oracledb');
const StatusError = require('../utils/StatusError');

const ACTIVE_CUSTOMER_STATUS = 1;

router.get('/check/:msisdn', async (req, res, next) => {
  const { msisdn } = req.params;
  let connection;

  try {
    // Get a connection from the default pool
    connection = await oracledb.getConnection();
    const sql = 'SELECT customer_id, status FROM customer WHERE msisdn = :b';
    const result = await connection.execute(sql, [msisdn], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    // eslint-disable-next-line no-console
    console.log(result);

    if (!result.rows.length) {
      return next(new StatusError({ statusCode: 404, message: 'Not found' }));
    }

    const { CUSTOMER_ID: account, STATUS: status } = result.rows[0];
    const resultDto = {
      account,
      status: Number(status) === ACTIVE_CUSTOMER_STATUS,
    };
    res.json(resultDto);
  } catch (err) {
    next(err);
  } finally {
    // oracledb.getPool()._logStats(); // show pool statistics.  _enableStats must be true
    if (connection) {
      // Put the connection back in the pool
      await connection.close();
    }
  }
});

module.exports = router;
