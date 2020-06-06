const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const f = require("util").format;
const log = require("../debug/logger.js");
const user = require("./findUser.js");

const DbUrl = "mongodb+srv://sheikh-spear:hjk@cluster0-sgf82.mongodb.net/test?retryWrites=true&w=majority"

async function findSpaceByCoordinates(userId, xbegin, ybegin, next) {
  return user.findUserByID(userId, results => {
    results.space.forEach(e => {
      findSpaceByID(e, r => {
        if (r.xbegin === xbegin && r.ybegin === ybegin) {
          next(r);
        }
      });
    });
  });
}

async function findSpaceByID(id, next) {
  return MongoClient.connect(DbUrl, function(error, db) {
    db
      .db("DevISA")
      .collection("space")
      .findOne({ _id: new ObjectID(id) }, function(error, results) {
        if (error) {
          log(error, 3);
          throw error;
        }
        log("Search returned:", 1);
        console.log(results);
        return next(results);
      });
  });
}

module.exports = {
    findSpaceByCoordinates,
    findSpaceByID
}