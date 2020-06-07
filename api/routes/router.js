const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const fetch = require("node-fetch");
require("es6-promise").polyfill();
require("isomorphic-fetch");
const users = require("../db/user.js");
const log = require("../debug/logger.js");
const jwt = require("jsonwebtoken");

const jwtKey = "THIS IS SPARTAAAAA!!!!!";
const jwtExpirySeconds = 30000000;

router.get("/everybody", async (req, res) => {
  try {
    var token;
    try {
      token = jwt.verify(req.headers.token, jwtKey);
      console.log(token);
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        return res.send({
          status: 401,
          message: "unknown token"
        });
      }
    }
    var UserId = token.id;
    users.markBefriendedPangolins(UserId, (e, r) => {
      if (e) {
        log(e, 3);
        res.send({
          status: 500,
          message: e
        });
      } else {
        res.send(r);
      }
    });
  } catch (err) {
    log(err, 3);
    res.send({
      status: 500,
      message: err
    });
  }
});

router.get("/friends", async (req, res) => {
  console.log("heyyy");
  try {
    var token;
    try {
      token = jwt.verify(req.headers.token, jwtKey);
      console.log(token);
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        return res.send({
          status: 401,
          message: "unknown token"
        });
      }
    }
    var UserId = token.id;
    users.getAllFriends(UserId, (e, r) => {
      if (e) {
        log(e, 3);
        log(r);
        res.send({
          status: 500,
          message: e
        });
      } else {
        res.send(r);
      }
    });
  } catch (err) {
    log(err, 3);
    res.send({
      status: 500,
      message: err
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    users.login(req.body, (error, user) => {
      if (error) {
        log(error, 3);
        res.send({
          status: 500,
          message: error
        });
      } else {
        id = user._id;
        const token = jwt.sign({ id }, jwtKey, {
          algorithm: "HS256",
          expiresIn: jwtExpirySeconds
        });
        log(token);
        res.send({
          status: 200,
          token: token,
          id: user.id,
          email: user.email,
          family: user.family,
          food: user.food,
          race: user.race
        });
      }
    });
  } catch (e) {
    log(e, 3);
    res.send({
      status: 500,
      message: "ko"
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    users.register(req.body, (error, user) => {
      try {
        if (error) {
          log(error, 3);
          res.send({
            status: 500,
            message: error
          });
        } else {
          res.send({
            status: 200,
            data: user
          });
        }
      } catch (e) {
        res.send({
          status: 500,
          error: e
        });
      }
    });
  } catch (e) {
    res.send({
      status: 500,
      error: e
    });
  }
});

router.post("/update", async (req, res) => {
  try {
    var token;
    try {
      token = jwt.verify(req.headers.token, jwtKey);
      console.log(token);
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        return res.send({
          status: 401,
          message: "unknown token"
        });
      }
    }
    users.update(token.id, req.body, (e, r) => {
      if (e) {
        log(e, 3);
        res.send({
          status: 500,
          message: e
        });
      } else {
        res.send({
          id: r.id,
          email: r.email,
          food: r.food,
          family: r.family,
          race: r.race,
          token: req.headers.token
        });
      }
    });
  } catch (err) {
    log(err, 3);
    res.send({
      status: 500,
      message: err
    });
  }
});

router.post("/addFriend", async (req, res) => {
  try {
    var token;
    try {
      token = jwt.verify(req.headers.token, jwtKey);
      console.log(token);
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        return res.send({
          status: 401,
          message: "unknown token"
        });
      }
    }
    users.addFriend(token.id, req.body.friend, (e, r) => {
      if (e) {
        log(e, 3);
        res.send({
          status: 500,
          message: e
        });
      } else {
        res.send({
          status: 200,
          data: r
        });
      }
    });
  } catch (err) {
    log(err, 3);
    res.send({
      status: 500,
      message: err
    });
  }
});

router.post("/deleteFriend", async (req, res) => {
  try {
    var token;
    try {
      token = jwt.verify(req.headers.token, jwtKey);
      console.log(token);
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        return res.send({
          status: 401,
          message: "unknown token"
        });
      }
    }
    users.deleteFriend(token.id, req.body.friend, (e, r) => {
      if (e) {
        log(e, 3);
        res.send({
          status: 500,
          message: e
        });
      } else {
        res.send({
          status: 200,
          data: r
        });
      }
    });
  } catch (err) {
    log(err, 3);
    res.send({
      status: 500,
      message: err
    });
  }
});

module.exports = router;
