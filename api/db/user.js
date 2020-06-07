const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
var crypto = require("crypto");
const f = require("util").format;
const log = require("../debug/logger.js");

const DbUrl =
  "mongodb+srv://sheikh-spear:hjk@cluster0-sgf82.mongodb.net/test?retryWrites=true&w=majority";

function deleteFriend(id, friend, next) {
  findByID(id, r => {
    newFriends = [];
    console.log(r);
    r.friends.forEach(f => {
      if (f !== friend) {
        newFriends.push(f);
      }
      if (f === r.friends[r.friends.length - 1]) {
        r.friends = newFriends;
        MongoClient.connect(DbUrl, function(error, db) {
          db.db("Pangolin").collection("Users").save(r, { w: 1 });
          if (error) throw error;
          next(null, r);
        });
      }
    });
  });
}

function markBefriendedPangolins(id, next) {
  data = [];
  findByID(id, r => {
    getAllPangolins((error, results) => {
      if (error) throw error;
      results.forEach(e => {
        p = {
          id: e.id,
          email: e.email,
          family: e.family,
          food: e.food,
          race: e.race,
          isfriend: "no"
        };
        for (let index = 0; index < r.friends.length; index++) {
          if (r.friends[index] === e.id.toString()) {
            p.isfriend = "yes";
          }
          console.log(id.toString());
          console.log(e.id.toString());
        }
        if (id.toString() !== e.id.toString()) {
          data.push(p);
        }
        if (e.id === results[results.length - 1].id) {
          next(null, data);
        }
      });
    });
  });
}

function getAllFriends(id, next) {
  data = [];
  findByID(id, r => {
    getAllPangolins((error, results) => {
      if (error) throw error;
      results.forEach(e => {
        console.log(e);
        console.log(r.friends);
        for (let index = 0; index < r.friends.length; index++) {
          if (r.friends[index] === e.id.toString()) {
            data.push(e);
          }
        }
        if (e.id === results[results.length - 1].id) {
          next(null, data);
        }
      });
    });
  });
}

function getAllPangolins(next) {
  MongoClient.connect(DbUrl, function(error, db) {
    db
      .db("Pangolin")
      .collection("Users")
      .find()
      .toArray(function(error, results) {
        if (error) {
          throw error;
        }
        pangolins = [];
        results.forEach(element => {
          pangolins.push({
            id: element._id,
            email: element.email,
            age: element.age,
            family: element.family,
            food: element.food,
            race: element.race
          });
          if (
            pangolins[pangolins.length - 1].id ===
            results[results.length - 1]._id
          ) {
            next(null, pangolins);
          }
        });
      });
  });
}

function addFriend(id, friend, next) {
  MongoClient.connect(DbUrl, function(error, db) {
    db
      .db("Pangolin")
      .collection("Users")
      .findOne({ _id: new ObjectID(id) }, function(error, results) {
        if (error) {
          throw error;
        }
        if (results) {
          results.friends.push(friend);
          MongoClient.connect(DbUrl, function(error, db) {
            db.db("Pangolin").collection("Users").save(results, { w: 1 });
            if (error) throw error;
            next(null, results);
          });
        } else {
          next("Something went wrong", null);
        }
      });
  });
}

function update(id, form, next) {
  MongoClient.connect(DbUrl, function(error, db) {
    db
      .db("Pangolin")
      .collection("Users")
      .findOne({ _id: new ObjectID(id) }, function(error, results) {
        if (error) {
          throw error;
        }
        if (results) {
          results.age = form.age;
          results.family = form.family;
          results.race = form.race;
          results.food = results.food;
          MongoClient.connect(DbUrl, function(error, db) {
            db.db("Pangolin").collection("Users").save(results, { w: 1 });
            if (error) throw error;
            next(null, results);
          });
        } else {
          next("Something went wrong", null);
        }
      });
  });
}

function login(form, next) {
  MongoClient.connect(DbUrl, function(error, db) {
    db
      .db("Pangolin")
      .collection("Users")
      .findOne({ email: form.email }, function(error, results) {
        if (error) {
          throw error;
        }
        if (results) {
          console.log(results);
          console.log(form);
          if (
            results.password ===
            crypto.createHash("md5").update(form.password).digest("hex")
          ) {
            next(null, results);
          } else {
            next("Login failed", null);
          }
        } else {
          next("Login failed", null);
        }
      });
  });
}

function register(form, next) {
  MongoClient.connect(DbUrl, function(error, db) {
    db
      .db("Pangolin")
      .collection("Users")
      .findOne({ email: form.email }, function(error, results) {
        if (results) {
          next("Email already exists", next);
          return;
        } else if (form.password !== form.password_repeat) {
          next("Passwords do not match", null);
          return;
        } else {
          newUser = {
            _id: new ObjectID(),
            email: form.email,
            password: crypto
              .createHash("md5")
              .update(form.password)
              .digest("hex"),
            age: form.age,
            family: form.family,
            race: form.race,
            food: form.food,
            friends: []
          };
          MongoClient.connect(DbUrl, function(error, db) {
            db.db("Pangolin").collection("Users").save(newUser, { w: 1 });
            if (error) throw error;
            next(false, newUser);
          });
        }
      });
  });
}

function findByID(id, next) {
  MongoClient.connect(DbUrl, function(error, db) {
    db
      .db("Pangolin")
      .collection("Users")
      .findOne({ _id: new ObjectID(id) }, function(error, results) {
        next(results);
      });
  });
}

module.exports = {
  login,
  register,
  update,
  addFriend,
  getAllPangolins,
  getAllFriends,
  markBefriendedPangolins,
  deleteFriend
};
