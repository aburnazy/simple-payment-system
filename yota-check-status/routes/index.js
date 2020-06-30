const express = require('express');
const oracledb = require('oracledb');

const router = express.Router();

/* GET home page. */
router.get('/check/:msisdn', async (req, res, next) => {
  const msisdn = req.params.msisdn;

  let connection;
  try {
    // Get a connection from the default pool
    connection = await oracledb.getConnection();
    const sql = `SELECT customer_id, status FROM customer WHERE msisdn = :b`;
    const binds = [msisdn];
    const options = {outFormat: oracledb.OUT_FORMAT_OBJECT};
    const result = await connection.execute(sql, binds, options);
    console.log(result);

    if(result.rows.length == 0) {
      throw {statusCode: 404, message: 'Not found'}
    }

    const resultDto = result.rows.map( row => {return { account: row['CUSTOMER_ID'], status: row['STATUS'] == 1 } } )[0]

    res.json(resultDto);
    // oracledb.getPool()._logStats(); // show pool statistics.  _enableStats must be true
  } catch (err) {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    console.error(err);
    res.status(err.statusCode).send(err);
  } finally {
    if (connection) {
      try {
        // Put the connection back in the pool
        await connection.close();
      } catch (err) {
        console.error(err);
        res.error(err);
      }
    }
  }
});

module.exports = router;
