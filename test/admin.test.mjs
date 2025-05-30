import request from "supertest";
import { app } from "../src/app.js";
import mongoose from 'mongoose';
import connectDb from "../src/db/index.js";
describe("Admin API", () => {
  let token;

  beforeAll(async () => {
      await connectDb();
    const res = await request(app)
      .post("/api/v1/users/login")
      .send({ email: "admin1@gmail.com", password: "12345" });
 const data = JSON.parse(res.text);
token = data.data.accessToken; 
  });
 afterAll(async () => {
    await mongoose.connection.close();
  });

  test("GET /api/v1/admin/users should return all users", async () => {
    const res = await request(app)
      .get("/api/v1/admin/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
