'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Borrowed, { foreignKey: 'book_id' });
    }
  }
  Book.init({
    book_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false
    },
    publication_year: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    average_rating: {
      type: DataTypes.STRING,
      allowNull: false
    },
    books_count: {
      type: DataTypes.STRING,
      allowNull: false
    },
    authors: {
        type: DataTypes.STRING,
        allowNull: false 
      }
    
  }, {
    sequelize,
    tableName: 'books',
    modelName: 'Book',
  });
  return Book;
};