'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('borroweds', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    // Change book_id from DATE to INTEGER
    await queryInterface.changeColumn('borroweds', 'book_id', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('borroweds', 'user_id', {
      type: Sequelize.DATE,
      allowNull: false
    });
    // Revert book_id back to DATE
    await queryInterface.changeColumn('borroweds', 'book_id', {
      type: Sequelize.DATE,
      allowNull: false
    });

  }
};
