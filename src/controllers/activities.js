import moment from "moment-timezone";
import fetch from "node-fetch";
import { pipedriveApiUrl } from "../constants/url.js";
import User from "../models/User.js";
import { getGists } from "./gists.js";
import express from "express";

/**
 * Create activities for each public gist the user has.
 * Request param createAll indicates if activities are created for all gists or only for gists added after
 * last activity creation.
 * Note that if user has not been scanned yet, the createAll param does nothing.
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function createActivities(req, res) {
  const { username } = req.params;
  const { createAll } = req.query;

  const user = await User.getByName(username);

  let gists = null;
  if (user) {
    const lastVisited = createAll === "true" ? null : user.lastVisited;
    gists = await getGists(username, lastVisited);
  } else {
    gists = await getGists(username);
  }

  if (!gists.length) {
    res.status(200).send({ message: "No Gists found to process." });
    return;
  }

  const results = [];

  try {
    await Promise.all(
      gists.map(async (gist) => {
        const body = getActivityBody(gist);

        const response = await fetch(
          `${pipedriveApiUrl}/activities?api_token=${process.env.PIPEDRIVE_API_TOKEN}`,
          {
            method: "post",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
          }
        );

        const result = await response.json();
        results.push(result.data);
        console.log(`Created Activity with id ${result.data.id}`);
      })
    );

    await handleUserSaving(username);
  } catch (e) {
    console.log(e);
  } finally {
    res.status(201).send(results);
  }
}

/**
 * Create activities for each public gist the user has.
 * Interval triggers every 30 seconds and 5 times.
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function createActivitiesInterval(req, res) {
  const { username } = req.params;

  let timesRan = 0;
  let createdCount = 0;
  const interval = setInterval(async () => {
    const user = await User.getByName(username);
    const lastVisited = user ? user.lastVisited : null;
    const gists = await getGists(username, lastVisited);

    try {
      if (!gists.length) {
        console.log("Interval found no gists to process");
      } else {
        await Promise.all(
          gists.map(async (gist) => {
            const body = getActivityBody(gist);

            const response = await fetch(
              `${pipedriveApiUrl}/activities?api_token=${process.env.PIPEDRIVE_API_TOKEN}`,
              {
                method: "post",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
              }
            );

            const result = await response.json();
            createdCount += 1;
            console.log(`Interval created Activity with id ${result.data.id}`);
          })
        );
      }

      await handleUserSaving(username);
    } catch (e) {
      console.log(e);
    } finally {
      timesRan += 1;
      if (timesRan === process.env.INTERVAL_RUN_TIMES) {
        res
          .status(200)
          .send({
            message: `Interval ran ${timesRan} times and created ${createdCount} Activities.`,
          });
        clearInterval(interval);
      } else {
        console.log(`Interval rotation ${timesRan} completed.`);
      }
    }
  }, process.env.INTERVAL_LENGTH);
}

/**
 * Get data from gist needed for activity creation.
 * @param gist
 * @returns body for activity creation
 */
const getActivityBody = (gist) => {
  const fileKeys = Object.keys(gist["files"]);
  const firstFile = gist["files"][fileKeys[0]];

  return {
    subject: `Activity from Gist "${firstFile.filename}"`,
  };
};

/**
 * Create new user or update existing users last visited datetime.
 * @param {string} name
 */
const handleUserSaving = async (name) => {
  const user = await User.getByName(name);
  const now = moment().format();
  if (user) {
    await user.updateLastVisited(user.id, now);
  } else {
    const newUser = new User(name, now);
    await newUser.create();
  }
};
