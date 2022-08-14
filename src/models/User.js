import db from "../config/db.js";

/**
 * User class
 */
export default class User {
  constructor(name, lastVisited, id = null) {
    this.name = name;
    this.lastVisited = lastVisited;
    this.id = id;
  }

  /**
   * Create new user.
   */
  async create() {
    const sql = `
      insert into users (name, lastVisited)
      values ('${this.name}', '${this.lastVisited}');`;

    const [data] = await db.execute(sql);

    console.log(`Created new user with id ${data.insertId}`);
  }

  /**
   * Get all users.
   * @returns all users
   */
  static async getAll() {
    const sql = `select * from users;`;

    const [users] = await db.execute(sql);

    return users;
  }

  /**
   * Get user by name.
   * @param {string} name
   * @returns user if found. Otherwise null.
   */
  static async getByName(name) {
    const sql = `select * from users where name = '${name}';`;

    const [users] = await db.execute(sql);

    if (!users.length) return null;

    return new User(users[0].Name, users[0].LastVisited, users[0].Id);
  }

  /**
   * Update last visited column for User
   * @param {int} id
   * @param {string} lastVisited
   */
  async updateLastVisited(id, lastVisited) {
    const sql = `update users set LastVisited = '${lastVisited}' where id = ${id};`;

    await db.execute(sql);

    console.log(`Updated user with id ${id}`);
  }
}
