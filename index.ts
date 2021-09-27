require("dotenv").config();
import express, { Request, Response } from "express";
import path from "path";

import * as authentication from "./controllers/authentication";

const initExpress = () => {
  const app = express();
  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, "./client/build")));

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

  // All remaining requests return the React app, so it can handle routing.
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
  });

  // port
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Express app listening at http:localhost:${process.env.PORT}`);
  });
};

const initApp = () => {
  initExpress();
};

initApp();
