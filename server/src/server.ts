import { Api } from "./app";
import { config } from "./config";
import net from "net";

Api.RunApp().then(async (app) => {
  app.listen(config.PORT, () => {
    console.log(`Server is running at ${config.PORT}`);
  });
});
