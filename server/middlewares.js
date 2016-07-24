var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var xml2js = require('xml2js');
var request = require('request');
var express = require('express');
var path = require('path');

//local modules
var cfg = require('../cfg.json');
var db = require('./db');
var goodreads = require('./goodreads');
var schema = require('./schemas.js');
var issue = require('./issue.js');
var book = require('./book.js');


/**
 * All http request handlers - export function that takes app and binds middlewares to it
 */
function bindMiddlewares(app){

  //body parser config
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  //Serve css files
  app.use('/css',express.static(path.join(__dirname, "../static/css")));


  //Test featured issue object
  featuredIssues = [
    {
      title:'Environment',
      bookList: [
        {
          title: 'book1',
          url: 'https://d.gr-assets.com/books/1372677697l/17910054.jpg'
        },
        {
          title: 'book2',
          url: 'https://d.gr-assets.com/books/1449830757l/28172483.jpg'
        },
        {
          title: 'book3',
          url:'https://d.gr-assets.com/books/1388690343l/17160008.jpg'
        }
      ]
    },

    {
      title:'Social',
      bookList: [
        {
          title: 'book1',
          url: 'https://d.gr-assets.com/books/1372677697l/17910054.jpg'
        },
        {
          title: 'book2',
          url: 'https://d.gr-assets.com/books/1449830757l/28172483.jpg'
        },
        {
          title: 'book3',
          url: 'https://d.gr-assets.com/books/1388690343l/17160008.jpg'
        }
      ]
    },

    {
      title:'Economic',
      bookList: [
        {
          title: 'book1',
          url: 'https://d.gr-assets.com/books/1372677697l/17910054.jpg'
        },
        {
          title: 'book2',
          url:'https://d.gr-assets.com/books/1449830757l/28172483.jpg'
        },
        {
          title: 'book3',
          url: 'https://d.gr-assets.com/books/1388690343l/17160008.jpg'
        }
      ]
    }
  ]

  //Home page request response
  app.get('/', function (req, res) {
      res.render(path.join(__dirname, '../client/templates/home.njk'), {navigation:navigation, featuredIssues:featuredIssues});
  });


  //Add book page request response
  app.get('/add/book', function (req, res) {
    if (!req.query.search) {
      res.render(path.join(__dirname, '../client/templates/addBook.njk'), {navigation:navigation});
    }
    else {
      var searchTerm = req.query.search;
      goodreads.searchGoodreads(searchTerm, function(error, listOfWorks){
        res.render(path.join(__dirname, '../client/templates/addBook.njk'), {navigation:navigation, listOfWorks:listOfWorks});
      });
    }
  });

  //Add book details page
  app.get('/add/book/:workID', function(req, res) {
    goodreads.getBookByGoodreadsID(req.params.workID, function(error, book){
      issue.Issue.find({}, function(error, docs){
        res.render(path.join(__dirname, '../client/templates/addBookDetails.njk'), {navigation:navigation, book:book, listOfIssues:docs});
      });
    });
  });

  //Get page for issue submision
  app.get('/add/issue', function(req, res){
    res.render(path.join(__dirname, '../client/templates/addIssue.njk'), {navigation:navigation});
  });

  // Add submitted issue to database
  app.post('/add/issue', function(req, res) {
    issue.checkExists(req.body.title, function(error, issueExists){
      console.log(req.body.title);
      if (issueExists) {
        console.log('this issue already exists');
        return res.render(path.join(__dirname, '../client/templates/addIssue.njk'), {navigation:navigation});
      }
      issue.addToDb(req.body, function (error, newIssue){
        issue.Issue.find({}, function(error, docs){
          console.log(docs);
          res.render(path.join(__dirname, '../client/templates/addIssue.njk'), {navigation:navigation});
        });
      });
    });
  });

  //Add submitted book to database
  app.post('/add/book/:bookID', function(req, res) {
    console.log('this is the req.body', req.body);
    book.checkExists(req.body.bookID, function(error, bookExists){
      if(bookExists) {
        //TODO check if the issue being submitted is attached to existing book.
        console.log('this book exists - write a function to check if issue exists');
        return res.render(path.join(__dirname, '../client/templates/addBook.njk'), {navigation:navigation});
      }
      //If book isn't already in the database, retrieve info from goodreads
      goodreads.getBookByGoodreadsID(req.body.bookID, function(error, bookObject){

        //Creates object to be added to Book's 'issues' field
        issue.Issue.findById(req.body._id, function(error, issue){
          console.log('the book is ' + bookObject);
          var newIssue = {
            title: issue.title,
            description: req.body.description,
            issueID: issue._id
          };
          if (bookObject.issues === undefined) {
            bookObject.issues = [newIssue];
          }
          else {
            bookObject.issues.push(newIssue);
          }

          //adds new book, including issue and description, to database
          book.addToDb(bookObject, function(error, book){
            console.log(JSON.stringify(book) + ' has been added to the database');
            return res.redirect('/');
          });
        });
      });
    });
  });

};

//Nav object
var navigation = [
  {
    title: 'Home',
    URL: '/'
  },
  {
    title: 'Add book',
    URL: '/add/book'
  },
  {
    title: 'Add issue',
    URL: '/add/issue'
  }
];

module.exports = {
  bind:bindMiddlewares
}
