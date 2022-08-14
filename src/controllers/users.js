import User from "../models/User.js";
import express from "express";

/**
 * Get all users.
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function list(req, res) {
  const users = await User.getAll();

  res.status(200).send({
    ...users,
  });
}
