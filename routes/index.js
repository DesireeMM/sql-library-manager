var express = require('express');
var router = express.Router();
var Book = require('../models').Book;

/* GET home page. */
router.get('/', async function(req, res, next) {
  const books = await Book.findAll();
  console.log(books);
  res.json(books);
});

/* GET books page */
router.get('/books', async function(req, res, next) {
  const books = await Book.findAll();
  res.render('index', {books})
});

/* Create a new book form */
router.get('/books/new', async function (req, res, next) {
  res.render('books/new', {book: {}, title:"New Book"})
});

/* POST create book */
router.post('/books/new', async function (req, res, next) {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id)
  } catch (error) {
    throw error;
  }
});

/* GET book detail form */
router.get('/books/:id', async function (req, res, next) {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('books/' + book.id);
  } else {
    res.sendStatus(404);
  }
});

/* POST update book info */
router.post('/books/:id', async function (req, res, next) {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books/' + book.id);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('books/' + book.id, {book, errors: error.errors, title: "Edit Book"})
    } else {
      throw error;
    }
  }
});

/* Delete a book form */
router.get('/books/:id/delete', async function(req, res, next) {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('books/delete', {book, title: "Delete book"});
  } else {
    res.sendStatus(404);
  }
});

/* Delete a book */
router.post('/books/:id/delete', async function (req, res, next) {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books')
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
