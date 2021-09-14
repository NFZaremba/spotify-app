import express, { Request, Response } from "express";
require("dotenv").config();

import * as authentication from "./controllers/authentication";

const initExpress = () => {
  const app = express();

  // routes
  app.get("/", (_req: Request, res: Response) => {
    const data = {
      name: "Nickzssss",
      isAwesome: true,
    };

    res.json(data);
  });
  app.get("/login", authentication.spotifyLogin);
  app.get("/callback", authentication.spotifyCallback);
  app.get("/refresh_token", authentication.spotifyRefresh);

  // port
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Express app listening at http:localhost:${process.env.PORT}`);
  });
};

const initApp = () => {
  initExpress();
};

initApp();
