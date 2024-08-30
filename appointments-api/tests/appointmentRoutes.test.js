const request = require("supertest");
const express = require("express");
const sequelize = require("../config/database");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const appointmentRoutes = require("../routes/appointmentRoutes");

const app = express();
app.use(express.json());
app.use("/api", appointmentRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await User.create({
    name: "John Doe",
    email: "john@example.com",
    password: "123456",
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Appointment Routes", () => {
  it("should create a new appointment", async () => {
    const res = await request(app).post("/api/appointments").send({
      userId: 1,
      date: "2024-09-01T10:00:00Z",
      description: "Consulta de rotina",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should retrieve all appointments", async () => {
    const res = await request(app).get("/api/appointments");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should update an appointment", async () => {
    const res = await request(app).put("/api/appointments/1").send({
      date: "2024-09-02T14:00:00Z",
      description: "Consulta de retorno",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.description).toBe("Consulta de retorno");
  });

  it("should delete an appointment", async () => {
    const res = await request(app).delete("/api/appointments/1");
    expect(res.statusCode).toEqual(204);
  });
});
