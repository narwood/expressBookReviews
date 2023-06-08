const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let usr = req.params.username;
  let pwd = req.params.password;
  if (!(usr&&pwd)) {
    return res.status(400).json(usr+pwd);
  }
  var unq = true;
  for (var user in users) {
      if (user["username"]===usr) {
          unq = false;
      }
  }
  if (unq) {
      users.push({"username": usr, "password": pwd})
      return res.status(300).json({message: "User sucessfully registered."});
  }
  else {return res.status(400).json({message: "User already registered."});}
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   let bookList = [];
   for (var i in books) {
       bookList.push(books[i]["title"]);
   }
   return res.status(300).json(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = parseInt(req.params.isbn);
  return res.status(300).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  for (var i in books) {
      if (books[i]["author"]===req.params.author) {
        return res.status(300).json(books[i]);
      }
  }
  return res.status(300).json("No matching author found. Check spelling/capitalization.");
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    for (var i in books) {
        if (books[i]["title"]===req.params.title) {
          return res.status(300).json(books[i]);
        }
    }
    return res.status(300).json("No matching title found. Check spelling/capitalization.");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return res.status(300).json(books[parseInt(req.params.isbn)]["reviews"]);
});

module.exports.general = public_users;