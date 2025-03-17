const { sequelize, Book, BorrowBook, User } = require('./models');
const { Op } = require('sequelize');
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
        include: [{
            model: BorrowBook, where: { return_date: null },
            required: false // Allows the Book to be found even if there are no BorrowBook rows
        }
        ],
    });
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }
    if (book.BorrowBook && book.BorrowBook.length > 0) {
        return res.status(400).json({ error: 'Book is currently BorrowBook' });
    }
    await book.destroy();
    res.json({ message: 'Book deleted' });
});

router.post('/borrow', async (req, res) => {
    try {
        const { user_id, book_id } = req.body;

        // Check if book exists
        const book = await Book.findByPk(book_id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Count active borrows where the book has not been returned
        const activeBorrows = await BorrowBook.count({
            where: {
                book_id,
                status: 'borrowed' // Ensure the status is actively borrowed
            }
        });

        // Ensure book is not borrowed more than available copies
        if (activeBorrows >= book.books_count) {
            return res.status(400).json({ error: 'No copies available' });
        }

        // Set due date (14 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        // Create borrow record
        await BorrowBook.create({
            user_id,
            book_id,
            borrow_date: new Date(),
            due_date: dueDate,
            return_date: null, // Ensure return_date is explicitly set to null
            status: 'borrowed', // Ensure status is marked correctly
        });

        res.json({ message: 'Book has been borrowed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
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

router.post('/return', async (req, res) => {
    const { user_id, book_id } = req.body;

    try {
        const transaction = await sequelize.transaction();

        const borrowRecord = await BorrowBook.findOne({
            where: {
                user_id,
                book_id,
                return_date: null 
            },
            transaction
        });

        if (!borrowRecord) {
            await transaction.rollback();
            return res.status(404).json({ error: 'No active borrow record found or book already returned' });
        }

        borrowRecord.return_date = new Date();
        borrowRecord.status = 'returned'; 
        await borrowRecord.save({ transaction });

        await transaction.commit();

        res.json({ message: 'Book returned successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to return book' });
    }
});


router.get('/overdue-books', async (req, res) => {
    try {
        const today = new Date(); 

        const overdueBooks = await BorrowBook.findAll({
            where: {
                due_date: { [Op.lt]: today }, 
                return_date: null 
            },
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'name', 'email'] 
                },
                {
                    model: Book,
                    attributes: ['book_id', 'title', 'isbn'] 
                }
            ]
        });

        const formattedData = overdueBooks.map(borrow => {
            const overdueDays = Math.floor((today - new Date(borrow.due_date)) / (1000 * 60 * 60 * 24)); // Calculate days overdue
            return {
                user: {
                    id: borrow.User.user_id,
                    name: borrow.User.name,
                    email: borrow.User.email
                },
                book: {
                    id: borrow.Book.book_id,
                    title: borrow.Book.title,
                    isbn: borrow.Book.isbn,
                    createdAt: borrow.createdAt

                },
                due_date: borrow.due_date,
                overdue_days: overdueDays
            };
        });

        res.json(formattedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch overdue books' });
    }
});

module.exports = router;












app.listen({ port: 5000 }, async () => {

    console.log("server app on localhost:5000");
    await sequelize.sync({ alter: true });
    console.log("Database sync");



});



