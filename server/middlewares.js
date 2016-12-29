const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const xml2js = require('xml2js')
const express = require('express')
const path = require('path')

//local modules
const cfg = require('../cfg.json')
const db = require('./db')
const goodreads = require('./goodreads')
const schema = require('./schemas.js')
const issue = require('./issue.js')
const book = require('./book.js')

function createErrorHandler(res) {
  return function (error) {
    console.error(error)
    res.render(path.join(__dirname, '..client/templates/404.njk'))
  }
}

/**
 * All http request handlers - export function that takes app and binds middlewares to it
 */
function bindMiddlewares(app){

  //body parser config
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  //Serve css files
  app.use('/css',express.static(path.join(__dirname, "../static/css")))


  //Home page request response
  app.get('/', (req, res) => {
    res.render(path.join(__dirname, '../client/templates/home.njk'), {
      navigation: navigation,
      featuredIssues: featuredIssues
    })
  })


  //Add book page request response
  app.get('/add/book', (req, res) => {
    if (!req.query.search) {
      return res.render(path.join(__dirname, '../client/templates/addBook.njk'), {
        navigation:navigation
      })
    }
    goodreads.searchGoodreads(req.query.search)
    .then(listOfWorks => {
      res.render(path.join(__dirname, '../client/templates/addBook.njk'), {
        navigation: navigation,
        listOfWorks: listOfWorks
      })
    })
    .catch(createErrorHandler(res))
  })


  //Book details page
  app.get('/add/book/:workID', (req, res) => {
    goodreads.getBookByGoodreadsID(req.params.workID)
    .then(book => {
      issue.Issue.find({})
      .then(docs => {
        res.render(path.join(__dirname, '../client/templates/addBookDetails.njk'), {
          navigation:navigation,
          book:book,
          listOfIssues:docs
        })
      })
      .catch(createErrorHandler(res))
    })
    .catch(createErrorHandler(res))
  })

  //Get page for issue submision
  app.get('/add/issue', (req, res) => {
    res.render(path.join(__dirname, '../client/templates/addIssue.njk'), {navigation:navigation})
  })

  // Add submitted issue to database
  app.post('/add/issue', (req, res) => {
    issue.checkExists(req.body.title)
    .then(issueExists => {
      if (issueExists) {
        return res.render(path.join(__dirname, '../client/templates/addIssue.njk'), {
          navigation:navigation
        })
      }
      else {
        return (
          issue.addToDb(req.body)
          .then(newIssue => res.render(path.join(__dirname, '../client/templates/addIssue.njk'), {
            navigation:navigation
          }))
        )
      }
    })
    .catch(createErrorHandler(res))
  })

  //Add submitted book to database
  app.post('/add/book/:bookID', function(req, res) {
    console.log('this is the req.body', req.body)
    book.checkExists(req.body.bookID)
    .then(bookExists => {
      if(bookExists) {
        //TODO check if the issue being submitted is attached to existing book.
        console.log('this book exists - write a function to check if issue exists')
        return res.render(path.join(__dirname, '../client/templates/addBook.njk'), {
          navigation:navigation
        })
      }
      else{
        //If book isn't already in the database, retrieve info from goodreads
        goodreads.getBookByGoodreadsID(req.body.bookID)
        .then(bookObject => {
          //Creates object to be added to Book's 'issues' field
          return issue.Issue.findById(req.body._id).then(issue => ({
            bookObject, issue
          }))
        })
        .then(({ bookObject, issue }) => {
          const newIssue = {
            title: issue.title,
            description: req.body.description,
            issueID: issue._id
          }
          if (bookObject.issues === undefined) {
            bookObject.issues = []
          }
          bookObject.issues.push(newIssue)
          return bookObject
        })
        .then(book.addToDb)
        .then(book => {
          return res.redirect('/')
        })
        .catch(createErrorHandler(res))
      }
    })
  })
}

/*
 * Dummy data for featured books and navigation
 */

//Test featured issue object
const featuredIssues = [
  {
    title:'Environment',
    bookList: [
      {
        title: 'The sixth extinction',
        url: 'https://d.gr-assets.com/books/1372677697l/17910054.jpg'
      },
      {
        title: 'book2',
        url: 'https://d.gr-assets.com/books/1391384454l/18079683.jpg'
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
        url: 'https://d.gr-assets.com/books/1356654499l/15796700.jpg'
      },
      {
        title: 'book2',
        url: 'https://d.gr-assets.com/books/1439328100l/25489025.jpg'
      },
      {
        title: 'book3',
        url: 'https://d.gr-assets.com/books/1400856552l/22125258.jpg'
      }
    ]
  },

  {
    title:'Economic',
    bookList: [
      {
        title: 'book1',
        url: 'https://d.gr-assets.com/books/1423586473l/24902492.jpg'
      },
      {
        title: 'book2',
        url:'https://d.gr-assets.com/books/1435732050l/25829156.jpg'
      },
      {
        title: 'book3',
        url: 'https://d.gr-assets.com/books/1453189881l/12262741.jpg'
      }
    ]
  }
]

//Nav object
const navigation = [
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
]

module.exports = {
  bind:bindMiddlewares
}
