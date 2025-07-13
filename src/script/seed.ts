import db from "../db/connection";

(async () => {
  try {
    await db("contacts").insert([
      {
        email: "lorraine@hillvalley.edu",
        phoneNumber: "123456",
        linkPrecedence: "primary",
        createdAt: "2023-04-01 00:00:00.374+00",
        updatedAt: "2023-04-01 00:00:00.374+00",
      },

      {
        email: "mcfly@hillvalley.edu",
        phoneNumber: "123456",
        linkPrecedence: "secondary",
        linkedId: 1,
        createdAt: "2023-04-20 05:30:00.11+00",
        updatedAt: "2023-04-20 05:30:00.11+00",
      },
    ]).returning('*')
    console.log("Data inserted to the table!");
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
