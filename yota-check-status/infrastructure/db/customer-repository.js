const oracledb = require('oracledb');

oracledb.autoCommit = true;

const TABLE_NAME = 'customer';
const COLUMNS = 'customer_id, status';

class CustomerRepository {
  static async get(customerEntity) {
    const { msisdn } = customerEntity;
    const sql = `SELECT ${COLUMNS} FROM ${TABLE_NAME} WHERE msisdn = :b`;
    return this._executeQuery(sql, [msisdn]);
  }

  static async _executeQuery(sql, binds) {
    const connection = await oracledb.getConnection();
    const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };

    return connection.execute(sql, binds, options).finally(async () => {
      if (connection) {
        await connection.close();
      }
    });
  }
}

module.exports = CustomerRepository;
