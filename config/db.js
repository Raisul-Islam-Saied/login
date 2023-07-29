const mongoose = require("mongoose");
const config = require("./config");

mongoose
  .connect(config.db.url)
  .then(() => {
    console.log("database is connected");
  })
  .catch((error) => {
    console.log("database is notconnected");
    console.log(error.message);
    process.exit(1);
  });
