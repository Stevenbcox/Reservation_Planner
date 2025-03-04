require("dotenv").config();
const { client, createTables, app } = require("./db");

const init = async () => {
  try {
    console.log("Connecting to database...");
    await client.connect();
    console.log("Connected to database.");

    await createTables();
    console.log("Tables created.");

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error initializing app:", error);
  }
};

init();
