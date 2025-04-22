'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Employee_Field_Mappings', {
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
      fieldId: {
        type: Sequelize.UUID,
        references: {
          model: 'Fields',
          key: 'fieldId'
        },
        onDelete: 'CASCADE'
      },
      domains: Sequelize.JSON,
      pprjCode: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Employee_Field_Mappings');
  }
};
