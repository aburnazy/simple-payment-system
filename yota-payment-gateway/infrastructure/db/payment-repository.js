const oracledb = require('oracledb');

oracledb.autoCommit = true;

const ID_SEQUENCE = 'PAYMENT_ID_SEQ';
const TABLE_NAME = 'PAYMENT';
const ALL_COLUMNS =
  'PAYMENT_ID, PAYMENT_DATE, OPERATION_ID, CUSTOMER_ID, PAYMENT_AMMOUNT, STATUS';

class PaymentRepository {
  static async create(paymentEntity) {
    const sql = `INSERT INTO ${TABLE_NAME}(${ALL_COLUMNS}) VALUES( ${ID_SEQUENCE}.nextval, :payment_date, :op, :custid, :amount, :status )`;
    const binds = {
      payment_date: paymentEntity.date,
      op: paymentEntity.operationCode,
      custid: paymentEntity.customerId,
      amount: paymentEntity.paymentAmount,
      status: paymentEntity.status ? 1 : 0,
    };

    return this._executeQuery(sql, binds);
  }

  static async _executeQuery(sql, binds) {
    // Get a connection from the default pool
    const connection = await oracledb.getConnection();
    const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };

    return connection.execute(sql, binds, options).finally(async () => {
      if (connection) {
        // Put the connection back in the pool
        await connection.close();
      }
    });
  }
}

module.exports = PaymentRepository;
