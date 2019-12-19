const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;
let _db;

const MongoConnect = callback => {
  MongoClient.connect(
    "mongodb+srv://pedro:myrKuBsW5JMe0xWT@cluster0-bm6fr.mongodb.net/test?retryWrites=true&w=majority"
  )
    .then(client => {
      console.log("Connected");
      _db = client.db();
      callback();
    })
    .catch(error => {
      console.log(error);
      throw error;
    });
};

const getDB = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.MongoConnect = MongoConnect;
exports.getDB = getDB;
