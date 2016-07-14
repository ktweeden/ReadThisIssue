var express = require("express");
var nunjucks  = require("nunjucks");
var path = require("path");

var app = express();

nunjucks.configure((path.join(__dirname, "../client/templates")), {
  autoescape: true,
  express   : app
});

var bookWrapper = {
  allBooks: [
    {
      title: "Human Acts",
      author: "Han Kang",
      summary: "A book from multiple perspectives about the guangju massacre",
      rating: "5/5"
    }
  ]
}

//Home page request response
app.get("/", function (req, res) {
  res.render(path.join(__dirname, "../client/templates/home.njk"), bookWrapper);
});




//Port listen
app.listen(3000, function () {
  console.log('Read This Issue listening on port 3000s');
});
