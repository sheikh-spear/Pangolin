const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

const DbUrl =
  "mongodb+srv://sheikh-spear:hjk@cluster0-sgf82.mongodb.net/test?retryWrites=true&w=majority";

async function deleteNode(nodeToDelete, next) {
  MongoClient.connect(DbUrl, function(error, db) {
    db
      .db("DevISA")
      .collection("nodes")
      .remove(nodeToDelete, null, function(err, res) {
        if (err) throw error;
        next();
      });
    if (error) throw error;
  });
}

async function deleteSpace(spaceToDelete, next) {
  MongoClient.connect(DbUrl, function(error, db) {
    db
      .db("DevISA")
      .collection("spaces")
      .remove(spaceToDelete, null, function(err, res) {
        if (err) throw error;
        next();
      });
    if (error) throw error;
  });
}
async function deleteUser(userToDelete, next) {
  MongoClient.connect(DbUrl, function(error, db) {
    db
      .db("DevISA")
      .collection("users")
      .remove(userToDelete, null, function(err, res) {
        if (err) throw error;
        next();
      });
    if (error) throw error;
  });
}
