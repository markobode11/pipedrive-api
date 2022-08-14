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
    const lastVisited = createAll === 'true' ? null : user.lastVisited;
    gists = await getGists(username, lastVisited);
  } else {
    gists = await getGists(username);
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
