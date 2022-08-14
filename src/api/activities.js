import { Router } from "express";
import { createActivities } from "../controllers/activities.js";

const users = () => {
  const router = Router();
  router.route("/:username").post(createActivities);

  return router;
};

export default users();
