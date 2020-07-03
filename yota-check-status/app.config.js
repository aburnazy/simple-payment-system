module.exports = {
  port: process.env.PORT || 3000,
  dbConfig: {
    user: process.env.NODE_ORACLEDB_USER || 'yotaott',
    password: process.env.NODE_ORACLEDB_PASSWORD || 'yota0TT',
    connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING || 'localhost:49161/xe',
    externalAuth: !!process.env.NODE_ORACLEDB_EXTERNALAUTH
  }
};
