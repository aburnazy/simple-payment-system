const oracledb = require('oracledb');
oracledb.autoCommit = true;

const Balance = require('../../domain/model/balance');

const ID_SEQUENCE = 'BALANCE_ID_SEQ';
const TABLE_NAME = 'BALANCE';
const ALL_COLUMNS = 'BALANCE_ID, CUSTOMER_ID, BALANCE, MODIFIED_ON';

class BalanceRepository {

    async findByCustomerId(customerId) {
        const sql = `SELECT * FROM ${TABLE_NAME} WHERE customer_id = :b`;
        const binds = [customerId];

        return  this._executeQuery(sql, binds).then( balanceResult => {
            const balanceEntities = this.toEntities(balanceResult);
            return balanceEntities.length ? balanceEntities[0] : null;
        } );
    }

    async updateBalanceById(balanceAmount, id) {
        const sql = `UPDATE ${TABLE_NAME} SET balance = :b WHERE balance_id = :c`;
        const binds = [balanceAmount, id];

        return this._executeQuery(sql, binds);
    }

    async create(balanceEntity) {
        const sql = `INSERT INTO ${TABLE_NAME}(${ALL_COLUMNS}) VALUES( ${ID_SEQUENCE}.nextval, :a, :b, SYSTIMESTAMP )`;
        const binds = [balanceEntity.customerId, balanceEntity.balance];

        return this._executeQuery(sql, binds);
    }

    async _executeQuery(sql, binds) {
        let connection, result;

        // Get a connection from the default pool
        connection = await oracledb.getConnection();
        const options = {outFormat: oracledb.OUT_FORMAT_OBJECT};

        return connection.execute(sql, binds, options).finally( async () => {
            if (connection) {
                // Put the connection back in the pool
                await connection.close();
            }
        } );
    }

    toEntities(dbResults) {
        return dbResults.
                rows.
                map( row => new Balance( row['BALANCE_ID'], row['CUSTOMER_ID'], row['BALANCE'] ) );
    }
}

const balanceRepository = new BalanceRepository();

module.exports = balanceRepository;