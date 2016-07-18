//All http request handlers - export function that takes app and binds middlewares to it

function bindMiddlewares(app){

  //body parser config
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  //Serve css files
  app.use(express.static(path.join(__dirname, "../static/css")));


  //Home page request response
  app.get('/', function (req, res) {
    if (!req.query.search) {
      //console.log("no search term entered");
      res.render(path.join(__dirname, '../client/templates/addBook.njk'));
    }
    else {
      //console.log (req.query);
      var searchTerm = req.query.search;
      goodreads.searchGoodreads(searchTerm, function(error, listOfWorks){
        //console.log(listOfWorks);
        res.render(path.join(__dirname, '../client/templates/addBook.njk'), {listOfWorks:listOfWorks});
      });
    }
  });

  //Add book details page
  app.get('/add/book/:workID', function(req, res) {
    goodreads.getBookByGoodreadsID(req.params.workID, function(error, book){
      schema.Issue.find({}, function(error, docs){
        res.render(path.join(__dirname, '../client/templates/addBookDetails.njk'), {book:book, listOfIssues:docs});
      });
    });
  });

  //Post request from add book details page
  //app.post('/add/book/:workID', function(req, res) {
    //console.log(req.body);
  //  res.redirect('/');
  //});

  //Get page for issue submision
  app.get('/add/issue', function(req, res){
    res.render(path.join(__dirname, '../client/templates/addIssue.njk'));
  });


  //Add submitted issue to database
  app.post('/add/issue', function(req, res) {
    db.checkIssueExists(req.body.title, function(error, issueExists){
      console.log(req.body.title);
      if (issueExists) {
        console.log('this issue already exists');
        return res.render(path.join(__dirname, '../client/templates/addIssue.njk'));
      }
      db.addIssueToDb(req.body, function (error, issue){
        schema.Issue.find({}, function(error, docs){
          console.log(docs);
          res.render(path.join(__dirname, '../client/templates/addIssue.njk'));
        });
      });
    });
  });

  //Add submitted book to database
  app.post('/add/book/:bookID', function(req, res) {
    console.log('this is the req.body', req.body);
    db.checkBookExists(req.body.bookID, function(error, bookExists){
      if(bookExists) {
        console.log('this book exists - write a function to check if issue exists');
        return res.render(path.join(__dirname, '../client/templates/addBook.njk'));
      }
      console.log('book ID is' + req.body.bookID);
      goodreads.getBookByGoodreadsID(req.body.bookID, function(error, bookObject){
        console.log('error is' + error);
        schema.Issue.findById(req.body._id, function(error, issue){
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
          db.addBookToDb(bookObject, function(error, book){
            console.log(JSON.stringify(book) + ' has been added to the database');
            return res.redirect('/');
          });
        });
      });
    });
  });
};

module.exports = {
  bind:bindMiddlewares
}
