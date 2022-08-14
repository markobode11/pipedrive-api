import { Router } from "express";
import users from "./users.js";
import gists from "./gists.js";
import activities from "./activities.js";

export default () => {
  const api = Router();

  api.use("/users", users);
  api.use("/gists", gists);
  api.use("/activities", activities);

  return api;
};
