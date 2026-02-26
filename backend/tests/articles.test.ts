import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import { app } from "../src/app";
import * as articleService from "../src/modules/articles/article.service";
import * as readlogService from "../src/modules/articles/readlog.service";

vi.mock("../src/modules/articles/article.service");
vi.mock("../src/modules/articles/readlog.service");

const token = jwt.sign({ role: "author" }, "test-secret", { subject: "author-1" });

describe("Article routes", () => {
  it("creates an article", async () => {
    vi.spyOn(articleService, "createArticle").mockResolvedValueOnce({
      id: "article-1",
      title: "Hello",
      content: "A".repeat(60),
      category: "Tech",
      status: "DRAFT",
      authorId: "author-1",
      createdAt: new Date(),
      deletedAt: null
    });

    const response = await request(app)
      .post("/articles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Hello",
        content: "A".repeat(60),
        category: "Tech"
      });

    expect(response.status).toBe(201);
    expect(response.body.Success).toBe(true);
  });

  it("lists author articles", async () => {
    vi.spyOn(articleService, "getAuthorArticles").mockResolvedValueOnce({
      items: [
        {
          id: "article-1",
          title: "Hello",
          category: "Tech",
          status: "DRAFT",
          createdAt: new Date(),
          isDeleted: false
        }
      ],
      total: 1
    });

    const response = await request(app)
      .get("/articles/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.TotalSize).toBe(1);
  });

  it("updates an article", async () => {
    vi.spyOn(articleService, "updateArticle").mockResolvedValueOnce({
      id: "article-1",
      title: "Updated",
      content: "A".repeat(60),
      category: "Tech",
      status: "PUBLISHED",
      authorId: "author-1",
      createdAt: new Date(),
      deletedAt: null
    });

    const response = await request(app)
      .put("/articles/article-1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated",
        content: "A".repeat(60)
      });

    expect(response.status).toBe(200);
    expect(response.body.Object.title).toBe("Updated");
  });

  it("deletes an article", async () => {
    vi.spyOn(articleService, "softDeleteArticle").mockResolvedValueOnce({
      id: "article-1"
    } as never);

    const response = await request(app)
      .delete("/articles/article-1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.Success).toBe(true);
  });

  it("lists published articles", async () => {
    vi.spyOn(articleService, "listPublishedArticles").mockResolvedValueOnce({
      items: [
        {
          id: "article-1",
          title: "Hello",
          category: "Tech",
          authorName: "Jane",
          createdAt: new Date()
        }
      ],
      total: 1
    });

    const response = await request(app).get("/articles");

    expect(response.status).toBe(200);
    expect(response.body.TotalSize).toBe(1);
  });

  it("gets article details and records read", async () => {
    vi.spyOn(articleService, "getPublishedArticleById").mockResolvedValueOnce({
      id: "article-1",
      title: "Hello",
      category: "Tech",
      content: "A".repeat(60),
      createdAt: new Date(),
      authorName: "Jane"
    });

    vi.spyOn(readlogService, "recordRead").mockResolvedValueOnce(undefined);

    const response = await request(app).get("/articles/article-1");

    expect(response.status).toBe(200);
    expect(response.body.Object.title).toBe("Hello");
  });
});
