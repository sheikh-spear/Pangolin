const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const f = require("util").format;
const log = require("../debug/logger.js");
const space = require("./findSpace.js");

const DbUrl = "mongodb+srv://sheikh-spear:hjk@cluster0-sgf82.mongodb.net/test?retryWrites=true&w=majority"

async function getNodesFromSpace(spaceId, next) {
  return space.findSpaceByID(spaceId, results => {
    var ret = [];
    var nodes = new Promise((resolve, reject) => {
      results.nodes.forEach(element => {
        findNodeByID(element, r => {
          ret.push(r);
          if (ret.length == results.nodes.length) next(ret);
        });
      });
    });
  });
}


async function findNodeByID(id, next) {
  return MongoClient.connect(DbUrl, function(error, db) {
    db
      .db("DevISA")
      .collection("nodes")
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
    findNodeByID,
    getNodesFromSpace
}