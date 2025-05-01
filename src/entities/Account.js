const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Account",
  tableName: "accounts",
  columns: {
    Accountid: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    username: { type: "varchar", unique: true },
    password: { type: "varchar" },
    token: { type: "text", nullable: true },
    isActive: { type: "boolean", default: true },
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
      joinColumn: { name: "userId" }
    }
  }
});
