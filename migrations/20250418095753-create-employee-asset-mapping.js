'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Employee_Asset_Mappings', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      employeeId: {
        type: Sequelize.UUID,
        references: {
          model: 'Employees',
          key: 'employeeId'
        },
        onDelete: 'CASCADE'
      },
      assetId: {
        type: Sequelize.UUID,
        references: {
          model: 'Assets',
          key: 'assetId'
        },
        onDelete: 'CASCADE'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Employee_Asset_Mappings');
  }
};
