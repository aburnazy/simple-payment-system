const oracledb = require('oracledb');
const Balance = require('../../domain/model/balance');

oracledb.autoCommit = true;

const ID_SEQUENCE = 'BALANCE_ID_SEQ';
const TABLE_NAME = 'BALANCE';
const ALL_COLUMNS = 'BALANCE_ID, CUSTOMER_ID, BALANCE, MODIFIED_ON';

class BalanceRepository {
  static async findByCustomerId(customerId) {
    const sql = `SELECT * FROM ${TABLE_NAME} WHERE customer_id = :b`;
    const binds = [customerId];

    return this._executeQuery(sql, binds).then((balanceResult) => {
      const balanceEntities = this.toEntities(balanceResult);
      return balanceEntities.length ? balanceEntities[0] : null;
    });
  }

  static async updateBalanceById(balanceAmount, id) {
    const sql = `UPDATE ${TABLE_NAME} SET balance = :b WHERE balance_id = :c`;
    const binds = [balanceAmount, id];

    return this._executeQuery(sql, binds);
  }

  static async create(balanceEntity) {
    const sql = `INSERT INTO ${TABLE_NAME}(${ALL_COLUMNS}) VALUES( ${ID_SEQUENCE}.nextval, :a, :b, SYSTIMESTAMP )`;
    const binds = [balanceEntity.customerId, balanceEntity.balance];

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

  static toEntities(dbResults) {
    return dbResults.rows.map(
      (row) => new Balance(row.BALANCE_ID, row.CUSTOMER_ID, row.BALANCE),
    );
  }
}

module.exports = BalanceRepository;
