module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("users", "user_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("users", "user_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
