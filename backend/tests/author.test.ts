import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import { app } from "../src/app";
import * as dashboardService from "../src/services/dashboard.service";

vi.mock("../src/services/dashboard.service");

const token = jwt.sign({ role: "author" }, "test-secret", { subject: "author-1" });

describe("Author dashboard", () => {
  it("returns dashboard data", async () => {
    vi.spyOn(dashboardService, "getAuthorDashboard").mockResolvedValueOnce({
      items: [
        {
          title: "Hello",
          createdAt: new Date(),
          totalViews: 10
        }
      ],
      total: 1
    });

    const response = await request(app)
      .get("/author/dashboard")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.TotalSize).toBe(1);
  });
});
