'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BorrowBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BorrowBook.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });

      // BorrowBook belongs to a Book
      BorrowBook.belongsTo(models.Book, {
        foreignKey: 'book_id',
        onDelete: 'CASCADE',
      });
      }
    }
  
  BorrowBook.init({
    
      borrowbook_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Matches table name
          key: 'user_id',
        },
        onDelete: 'CASCADE',
      },
      book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'books',
          key: 'book_id',
        },
        onDelete: 'CASCADE',
      },
      borrow_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false,

      },
      return_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('borrowed', 'returned', 'overdue'),
        allowNull: false,
        defaultValue: 'borrowed',
      },
  },

       { sequelize,
    modelName: 'BorrowBook',
    timestamps: true, // Includes createdAt & updatedAt
    tableName: 'borrow_books',
  });

  return BorrowBook;
}
