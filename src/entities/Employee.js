// /src/entities/Employee.js
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: "Employee",
  tableName: "employees",
  columns: {
    employeeId: {
        primary: true,
        type: "uuid",
        generated: "uuid"
    },
    empCode: {
      type: "varchar",
      nullable: false,
      unique: true
    },
    department: {
      type: "varchar",
      nullable: true
    },
    designation: {
      type: "varchar",
      nullable: true
    },
    doj: {
      type: "date",
      nullable: false
    },
    dol: {
      type: "date",
      nullable: true
    },
    status: {
      type: "varchar",
      nullable: false
    },
    jobCategory: {
      type: "varchar",
      nullable: true
    },
    jobRole: {
      type: "varchar",
      nullable: true
    },
    reportingManager: {
      type: "varchar",
      nullable: true
    },
    createdAt: {
      type: "timestamp",
      createDate: true
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true
    }
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "userId" },
      nullable: false
    }
  }
});
