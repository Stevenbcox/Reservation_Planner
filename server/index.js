// const client = require("./db");
const pg = require("pg");
const { createTables } = require("./db");

const client = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "reservation_planner",
  password: "Password",
  port: 5432,
});

const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("created tables");

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

init();
