'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Employees', {
      employeeId: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'userId'
        },
        onDelete: 'CASCADE'
      },
      empCode: Sequelize.STRING,
      department: Sequelize.STRING,
      designation: Sequelize.STRING,
      doj: Sequelize.DATE,
      dol: Sequelize.DATE,
      status: {
        type: Sequelize.ENUM('active', 'inactive')
      },
      jobCategory: Sequelize.STRING,
      jobRole: Sequelize.STRING,
      reportingManager: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Employees');
  }
};
