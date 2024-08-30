const request = require("supertest");
const express = require("express");
const sequelize = require("../config/database");
const User = require("../models/User");
const userRoutes = require("../routes/userRoutes");

const app = express();
app.use(express.json());
app.use("/api", userRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("User Routes", () => {
  it("SHOULD CREATE A NEW USER", async () => {
    const res = await request(app).post("/api/users").send({
      name: "Test User",
      email: "test@example.com",
      password: "password",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should retrieve all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
