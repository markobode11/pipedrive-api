import { Router } from "express";
import { list } from "../controllers/users.js";

const users = () => {
  const router = Router();
  router.route("/").get(list);

  return router;
};

export default users();
