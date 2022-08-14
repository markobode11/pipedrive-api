import { Router } from "express";
import { createActivities, createActivitiesInterval } from "../controllers/activities.js";

const users = () => {
  const router = Router();
  router.route("/:username").post(createActivities);
  router.route("/:username/interval").post(createActivitiesInterval);

  return router;
};

export default users();
