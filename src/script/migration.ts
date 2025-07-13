import db from "../db/connection";

(async () => {
  try {
    await db.schema.dropTableIfExists("contacts");
    await db.schema.createTable("contacts", (table) => {
      table.increments("id"), table.string("phoneNumber");
      table.string("email");
      table.integer("linkedId");
      table.enum("linkPrecedence", ["secondary", "primary"]);
      table.dateTime("createdAt");
      table.dateTime("updatedAt");
      table.dateTime("deletedAt");
    });
    console.log("Created contact table!");
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
