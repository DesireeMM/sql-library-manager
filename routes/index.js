var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.redirect('/books');
});

/* GET books page */
router.get('/books', async function(req, res, next) {
  const resultsPerPage = 10;
  const page = req.query.page;
  const offset = (page - 1) * resultsPerPage;
  const limit = resultsPerPage;
  const {numResults, books} = await Book.findAndCountAll({
    limit: limit,
    offset: offset
  });
  const numPages = Math.ceil(numResults / resultsPerPage)
  res.render('index', {books, page, numPages, title: "Books"})
});

/* GET filtered books */
router.get('/books/search?:query', async function (req, res, next) {
  const searchCat = req.query.searchCat;
  const searchTerm = req.query.searchTerm;
  if (searchCat === "title") {
    const whereObject = {title: {[Op.iLike]: `%${searchTerm}%`}}
  } else if (searchCat === "author") {
    const whereObject = {author: {[Op.iLike]: `%${searchTerm}%`}}
  } else if (searchCat === genre) {
    const whereObject = {genre: {[Op.iLike]: `%${searchTerm}%`}}
  } else {
    const whereObject = {year: {[Op.like]: `%${searchTerm}%`}}
  }
  const books = await Book.findAll({
    where: whereObject
  });
  res.render('index', {books, title: "Search Results"})
})

/* Create a new book form */
router.get('/books/new', async function (req, res, next) {
  res.render('new-book', {book: {}, title:"New Book"})
});

/* POST create book */
router.post('/books/new', async function (req, res, next) {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books")
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id
      res.render('new-book', {book, errors: error.errors, title: "New Book"})
    } else {
      throw error;
    }
  }
});

/* GET book detail form */
router.get('/books/:id', async function (req, res, next) {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', {book, title: "Edit Book"});
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
      res.redirect('/books');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', {book, errors: error.errors, title: "Edit Book"})
    } else {
      throw error;
    }
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
