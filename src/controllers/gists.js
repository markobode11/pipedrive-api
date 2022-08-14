import fetch from "node-fetch";
import { gitApiUrl } from "../constants/url.js";
import User from "../models/User.js";
import express from "express";

/**
 * Get public gists by GitHub username.
 * If param sinceLastVisit is true, only gists added after last Activity creation are returned.
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns public gists
 */
export async function getByUsername(req, res) {
  const { username } = req.params;
  const { sinceLastVisit } = req.query;

  let gists = null;
  if (sinceLastVisit === "true") {
    const user = await User.getByName(username);

    if (!user) {
      res.status(400).send({ message: "No such user." });
      return;
    }

    gists = await getGists(username, user.lastVisited);
  } else {
    gists = await getGists(username);
  }

  res.status(200).send({
    count: gists.length,
    gists,
  });
}

/**
 * Helper function to create the url and fetch gists.
 * @param {string} username
 * @param {Date} lastVisited
 * @returns public gists
 */
export async function getGists(username, lastVisited = null) {
  const url = `${gitApiUrl}/users/${username}/gists${
    lastVisited ? `?since=${lastVisited.toISOString()}` : ""
  }`;
  const response = await fetch(url);
  const gists = await response.json();

  return gists;
}
