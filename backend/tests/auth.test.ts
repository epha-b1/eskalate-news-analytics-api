import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { app } from "../src/app";
import * as authService from "../src/modules/auth/auth.service";

vi.mock("../src/modules/auth/auth.service");

describe("Auth routes", () => {
  it("creates a user", async () => {
    vi.spyOn(authService, "signup").mockResolvedValueOnce({
      id: "user-1",
      name: "Jane Doe",
      email: "jane@example.com",
      role: "author"
    });

    const response = await request(app).post("/auth/signup").send({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "StrongPass1!",
      role: "author"
    });

    expect(response.status).toBe(201);
    expect(response.body.Success).toBe(true);
  });

  it("logs in a user", async () => {
    vi.spyOn(authService, "login").mockResolvedValueOnce({ token: "token" });

    const response = await request(app).post("/auth/login").send({
      email: "jane@example.com",
      password: "StrongPass1!"
    });

    expect(response.status).toBe(200);
    expect(response.body.Object.token).toBe("token");
  });
});
