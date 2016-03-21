var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://localhost:5432/librarydb');
var db = require("./models/");
var bodyParser = require("body-parser");

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json())

app.get('/', function(request, response) {
  	sequelize.sync().then(() => {
		//Model.findOrCreate[[sequelize method]]
		db.book.findAll({}).then(function(books) {
			response.render('pages/library');
			// response.send('pages/library', {books: books});
			// response.end(books);
		});
	});
});
// This gets the current list of books in the database.
app.get('/books', function(request, response) {
	//Sync the database
	sequelize.sync().then(() => {
		//Model.findOrCreate[[sequelize method]]
		db.book.findAll({}).then(function(books) {
			// console.log("books", books);
			response.send(books);
		});
	});
});
// Books is currently the main function putting items into the database. For Barcode Scanner.
app.post('/books', function(request, response) {
	//Sync the database
	sequelize.sync().then(() => {
		//Model.findOrCreate[[sequelize method]]
		db.book.findOrCreate({
			where:{
				title: request.body.title,
				author: request.body.author,
				location: request.body.location || ""
			}
			// Caught the output of findOrCreate. Check docs.
		}).spread(function(book, created) {
			if (created) {
				response.send("Book added.")

			} else {
				response.send("Book already exists in library.");
			}
		});
	});
});
// ":" - Anything after the colon is a parameter of req. e.g. req.params.id.
app.delete('/:id', function (req, res) {
	db.book.findOne({id:req.params.id})
	.then(function(book) {
  		return book.destroy();

	}).then(function() {
		//End required to stop browser.
		res.end();
	})
});

app.put('/:id', function (req, res) {
	console.log("res", res);
	console.log("REQ DOT BODY", req);
	db.book.findOne({id:req.params.id})
	.then(function(book) {
		book.update({
  			title:req.body.title,
			author:req.body.author,
			location:req.body.location
		})
		.then(function(){
			res.end();
		})
	})
})
// var gid = ...;
// var uid = ...;

// var values = { gid: gid };
// var selector = { where: { uid: uid } };
// myModel.update(values, selector)
// .then(function() {
//     // update callback
// });






// Films is an unfinished post for future use.
app.post('/films', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

