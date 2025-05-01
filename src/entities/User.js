const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    userId: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    firstName: {
      type: "varchar",
      nullable: false
    },
    lastName: {
      type: "varchar",
      nullable: false
    },
    email: {
      type: "varchar",
      unique: true,
      nullable: false
    },
    phoneNumber: {
      type: "varchar",
      nullable: true
    },
    aadharCard: {
      type: "varchar",
      unique: true,
      nullable: true
    },
    age: {
      type: "int",
      nullable: true
    },
    dob: {
      type: "date",
      nullable: true
    },
    address: {
      type: "text",
      nullable: true
    },

    empCode: {
      type: "varchar",
      unique: true,
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
  }
});
