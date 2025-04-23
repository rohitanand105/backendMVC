'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Fields', {
      fieldId: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      customerId: {
        type: Sequelize.UUID,
        references: {
          model: 'Customers',
          key: 'customerId'
        },
        onDelete: 'CASCADE'
      },
      circleId: Sequelize.STRING,
      cityId: Sequelize.STRING,
      fieldMeta: Sequelize.JSON,
      cluster: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Fields');
  }
};
