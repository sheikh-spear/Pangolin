const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const f = require("util").format;
const log = require("../debug/logger.js");

const DbUrl =
  "mongodb+srv://sheikh-spear:hjk@cluster0-sgf82.mongodb.net/test?retryWrites=true&w=majority";

async function writeNode(nodeToWrite, next) {
  MongoClient.connect(DbUrl, function(error, db) {
    db.db("DevISA").collection("nodes").save(nodeToWrite, { w: 1 });
    if (error) throw error;
    next();
  });
}

async function writeSpace(nodeToWrite, next) {
  MongoClient.connect(DbUrl, function(error, db) {
    db.db("DevISA").collection("spaces").save(nodeToWrite, { w: 1 });
    if (error) throw error;
    next();
  });
}

async function writeUser(nodeToWrite, next) {
  MongoClient.connect(DbUrl, function(error, db) {
    db.db("DevISA").collection("users").save(nodeToWrite, { w: 1 });
    if (error) throw error;
    next();
  });
}

module.exports = {
  writeNode,
  writeSpace,
  writeUser
};
