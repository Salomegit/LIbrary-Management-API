const { sequelize,Book } = require('./models');
const express = require('express');
const app = express();

app.use(express.json());
app.post('/create-book', async (req, res) => {

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
 app.listen({ port:5000 },async () => {

    console.log("server app on localhost:5000");
    await sequelize.sync({force: true});
    console.log("Database sync");

 });



