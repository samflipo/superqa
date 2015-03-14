var dbName = process.env.DBNAME || 'superqa';
var mongoskin = require('mongoskin').db("mongodb://localhost:27017/" + dbName, { safe: true });

exports.db = mongoskin;
