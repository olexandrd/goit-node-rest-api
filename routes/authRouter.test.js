import request from "supertest";
import { User } from "../models/User.js";
import app from "../app.js";

describe("Test login route", () => {
  let server;
  const loginData = {
    email: "test@example.com",
    password: "123456",
  };
  beforeAll(async () => {
    server = app.listen(3000);
    await User.sync();
    await request(app).post("/api/auth/register").send(loginData);
  });
  it("Unverified email login", async () => {
    const { status, body } = await request(app)
      .post("/api/auth/login")
      .send({ ...loginData, email: "test@example.com" });
    expect(status).toEqual(403);
    expect(body.message).toBeDefined();
    expect(body.message).toMatch(/Email not verified/);
  });
  it("Successful login", async () => {
    await User.update(
      { verify: true, verificationToken: null },
      { where: { email: loginData.email } }
    );
    const { status, body } = await request(app)
      .post("/api/auth/login")
      .send(loginData);

    expect(status).toEqual(200);
    expect(body.token).toBeDefined();
    expect(body.user.email).toEqual(loginData.email);
    expect(typeof body.user.email).toBe("string");
    expect(typeof body.user.subscription).toBe("string");
  });
  it("Login with wrong formatted email", async () => {
    const { status, body } = await request(app)
      .post("/api/auth/login")
      .send({ ...loginData, email: "testexample.com" });
    expect(status).toEqual(400);
    expect(body.message).toBeDefined();
    expect(body.message).toMatch(/must be a valid email/);
  });
  it("Login with wrong credentials", async () => {
    const { status, body } = await request(app)
      .post("/api/auth/login")
      .send({ ...loginData, password: "1234567" });
    expect(status).toEqual(401);
    expect(body.message).toBeDefined();
    expect(body.message).toMatch(/Email or password is wrong/);
  });
  afterAll(() => {
    server.close();
  });
});
