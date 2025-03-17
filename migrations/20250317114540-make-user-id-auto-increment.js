'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TABLE borroweds DROP FOREIGN KEY borroweds_ibfk_2;"
    );
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn("users", "user_id", {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn("users", "user_id", {
      type: Sequelize.INTEGER,
      autoIncrement: true, // Revert if needed
      allowNull: false,
    });
  

  }
};
