const app = require("./app");
const config = require("./config/config");
const PORT = config.app.port;
app.listen(PORT, () => {
  console.log(`your server is listening at http://localhost:${PORT}`);
});
