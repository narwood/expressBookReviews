const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  for (var user in users) {
    if (user["username"]===username) {
        return true;
    }
}
  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  for (var user in users) {
    if (user["username"]===username) {
        if (user["password"]===password) {
          return true;
        }
        else {
          return false;
        }
    }
}
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60*60});
    req.session.authorization = {accessToken, username}
    return res.status(200).json({message: "User successfully logged in."})
  }
  else {
    return res.status(300).json({message: "Username and password do not match our records. Please try again."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
