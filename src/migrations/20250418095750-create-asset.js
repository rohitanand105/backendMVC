'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Assets', {
      assetId: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      fieldId: {
        type: Sequelize.UUID,
        references: {
          model: 'Fields',
          key: 'fieldId'
        },
        onDelete: 'CASCADE'
      },
      serviceType: Sequelize.STRING,
      jc: Sequelize.STRING,
      domain: Sequelize.STRING,
      siteId: Sequelize.STRING,
      siteType: Sequelize.STRING,
      noOfDG: Sequelize.INTEGER,
      dgOperationalStatus: Sequelize.STRING,
      noOfBattery: Sequelize.INTEGER,
      noOfSMPS: Sequelize.INTEGER,
      noOfRM: Sequelize.INTEGER,
      techEmpId: Sequelize.STRING,
      riggerEmpId: Sequelize.STRING,
      supervisorEmpId: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Assets');
  }
};
