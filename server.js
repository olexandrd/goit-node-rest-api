import config from "./config/config.js";
import app from "./app.js";
import { db_connection_check } from "./helpers/db_sync.js";

app.listen(config.PORT, config.DOMAIN, () => {
  console.log(
    `Server is running. Use our API on port: ${config.PORT}\
    \nhttp://${config.DOMAIN}:${config.PORT}`
  );
});

db_connection_check();
