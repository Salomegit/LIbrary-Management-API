const { sequelize, Book, BorrowBook,User } = require('./models');
const express = require('express');
const router = express.Router();
const app = express();


app.use(express.json());
app.use('/v1', router);

router.post('/create-book', async (req, res) => {

    const {  
        book_id,
        title,
        isbn,
        publication_year,
        image_url,
        average_rating,
        books_count,
        authors } = req.body;
    
    try {
        const book = await Book.create({
            book_id,
            title,
            isbn,
            publication_year,
            image_url,
            average_rating,
            books_count,
            authors
        });
        res.status(201).json(book);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get('/all-books', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    try {
      const books = await Book.findAll({ limit, offset });
      res.json(books);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  });

  router.delete('/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id, {
      include: [{ model: Borrowed, where: { return_date: null },
        required: false // Allows the Book to be found even if there are no Borrowed rows
     }
    ],
    });
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      if (book.Borrowed && book.Borrowed.length > 0) {
        return res.status(400).json({ error: 'Book is currently borrowed' });
      }
    await book.destroy();
    res.json({ message: 'Book deleted' });
  });

  router.post('/borrow', async (req, res) => {
    const { user_id, book_id } = req.body;
    // Check if book is available
    const activeBorrows = await BorrowBook.count({
      where: { book_id, return_date: null }
    });
    const book = await Book.findByPk(book_id);
    if (activeBorrows >= book.books_count) {
      return res.status(400).json({ error: 'No copies available' });
    }
    // Create borrow record
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    await Borrowed.create({
      user_id,
      book_id,
      due_date: dueDate
    });
    res.json({ message: 'Book borrowed' });
  });

  router.post('/users', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const user = await User.create({ name, email });
        res.status(201).json(user);
    } catch (error) {
        console.error(error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Email already exists' });
        }

        res.status(500).json({ error: 'Failed to create user' });
    }
});














 app.listen({ port:5000 },async () => {

    console.log("server app on localhost:5000");
    await sequelize.sync({alter: true});
    console.log("Database sync");



 });



