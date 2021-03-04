const request = require("supertest");
const fsPromise = require("fs/promises");
const app = require("./app");
const { DB } = require("./api/shorturl");

// tests for Post Route Tests
describe("Post Route Tests", () => {
  const existUrl = { url: "https://www.youtube.com/watch?v=tIuU_ra1YmY" };

  const expectedResultExistUrl = {
    originalUrl: "https://www.youtube.com/watch?v=tIuU_ra1YmY",
    shortUrlId: "1614871697604",
    redirectCount: 6,
    creationDate: "2021-3-4 17:28:17",
  };

  const invalidUrl = { url: "notValidUrl.com" };
  const messageInvalidUrl = { massage: `${new Error()} Invalid URL` };

  const newUrl = { url: "https://www.sport5.co.il/" };

  it("Should return an error message with status code 400 for invalid url", async () => {
    const response = await request(app)
      .post("/api/shorturl/new")
      .send(invalidUrl);

    expect(response.status).toBe(400);

    // Is the body equal expectedResult
    expect(response.body).toEqual(messageInvalidUrl);
  });

  it("Should get an existing url and return the same short url", async () => {
    const existShortUrl = DB.urlData[0].shortUrlId;
    const response = await request(app)
      .post("/api/shorturl/new")
      .send(existUrl);
    // Is the status code 200
    expect(response.status).toBe(200);

    // Is the body equal expectedResult
    expect(existShortUrl).toEqual(expectedResultExistUrl.shortUrlId);
  });

  it("Should get a new url and return url data object", async () => {
    let DBLength = DB.urlData.length;
    const response = await request(app).post("/api/shorturl/new").send(newUrl);

    expect(DB.urlData.length).not.toBe(DBLength);
  });
});
