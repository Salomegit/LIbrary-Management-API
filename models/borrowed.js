'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Borrowed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'user_id' });
      this.belongsTo(models.Book, { foreignKey: 'book_id' }); 
         }
  }
  Borrowed.init({
    borrow_date: { type: DataTypes.DATE, allowNull: false},
    due_date: { type: DataTypes.DATE, allowNull: false},
    return_date: { type: DataTypes.DATE, allowNull: false},
    user_id: { type: DataTypes.DATE, allowNull: false},
    book_id:{ type: DataTypes.DATE, allowNull: false}
  }, {
    sequelize,
    modelName: 'Borrowed',
    tableName: 'borrowed'

  });
  return Borrowed;
};