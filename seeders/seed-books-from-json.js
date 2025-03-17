const fs = require('fs');
const path = require('path');

module.exports = {
  async up(queryInterface) {
    // Read JSON file
    const booksData = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../book.json'), 'utf-8')
    );

    await queryInterface.sequelize.query(
      'ALTER TABLE books MODIFY COLUMN book_id INTEGER;'
    );

    await queryInterface.bulkInsert('books', booksData.map(book => ({
      book_id: book.book_id,
      title: book.title,
      isbn: book.isbn,
      publication_year: book.publication_year,
      authors: book.authors,
      image_url: book.image_url,
      average_rating: book.average_rating,
      books_count: book.books_count,
      createdAt: new Date(),
      updatedAt: new Date()
    })));

    await queryInterface.sequelize.query(
      'ALTER TABLE books MODIFY COLUMN book_id INTEGER AUTO_INCREMENT;'
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('books', null, {});
  }
};