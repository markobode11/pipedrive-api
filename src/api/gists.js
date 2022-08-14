import { Router } from "express";
import { getByUsername } from "../controllers/gists.js";

const users = () => {
  const router = Router();
  router.route("/:username").get(getByUsername);

  return router;
};

export default users();