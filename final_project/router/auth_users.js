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
    let validUser = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validUser.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

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
  let isbn = parseInt(req.params.isbn);
  if (books[isbn]) {
      books[isbn].reviews[req.session.authorization.username] = req.body.review;
      return res.status(200).json({message: "Review successfully posted."});
  }
  else {
      return res.status(300).json({message: "ISBN not found."});
  }
});

//delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = parseInt(req.params.isbn);
  if (books[isbn]) {
      delete books[isbn].reviews[req.session.authorization.username];
      return res.status(200).json({message: "Review successfully deleted."});
  }
  else {
      return res.status(300).json({message: "ISBN not found."});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
