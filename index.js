var express = require('express');
var app = express();
var db = require("./models/");
var bodyParser = require("body-parser");

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json())

app.get('/', function(request, response) {
  	db.sequelize.sync().then(function() {
		//Model.findOrCreate[[sequelize method]]
		db.book.findAll({}).then(function(books) {
			response.render('pages/library');
		});
	});
});

// This gets the current list of books in the database.
app.get('/books', function(request, response) {
	//Sync the database
	db.sequelize.sync().then(function() {
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
	db.sequelize.sync().then(function() {
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
				response.send("Book Added. <button onclick='window.history.back()'>Back to Library</button>")
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
	console.log("REQ DOT PARAMS", req.params);
	db.book.findOne({where: {id:req.params.id}})
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

// Films is an unfinished post for future use.
// app.post('/films', function(request, response) {
//   response.render('pages/index');
// });

db.sequelize.sync().then(function() {
	app.listen(app.get('port'), function() {
	  console.log('Node app is running on port', app.get('port'));
	});
});

