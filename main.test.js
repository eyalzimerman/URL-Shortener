const request = require("supertest");
const fsPromise = require("fs/promises");
const app = require("./app");
const { DB } = require("./api/shorturl");

const existUrl = { url: "https://www.youtube.com/watch?v=tIuU_ra1YmY" };
const newUrl = { url: "https://www.sport5.co.il/" };

const expectedResultExistUrl = {
  originalUrl: "https://www.youtube.com/watch?v=tIuU_ra1YmY",
  shortUrlId: "1614871697604",
  redirectCount: 0,
  creationDate: "2021-3-4 17:28:17",
};

const invalidUrl = { url: "notValidUrl.com" };
const messageInvalidUrl = { massage: `${new Error()} Invalid URL` };
const messageNotFound = { message: `${new Error()} Short Url Is Not Found` };
const messageNotFormat = { message: "ERROR: Wrong Format" };
const messageNotExist = {
  message: `${new Error()} Short Url Does Not Exist`,
};

// tests for Post Route Tests
describe("Post Route Tests", () => {
  it("Should return an error message with status code 400 for invalid url", async () => {
    const response = await request(app)
      .post("/api/shorturl/new")
      .send(invalidUrl);

    expect(response.status).toBe(400);

    // Is the body equal expectedResult
    expect(response.body).toEqual(messageInvalidUrl);
  });

  it("Should get an existing url and return the same short url", async () => {
    const response = await request(app)
      .post("/api/shorturl/new")
      .send(existUrl);
    const response2 = await request(app)
      .post("/api/shorturl/new")
      .send(existUrl);
    const existShortUrl = response2.body.shortUrlId;
    const existCreationTime = response2.body.creationDate;

    // Is the status code 200
    expect(response2.status).toBe(200);

    // Is the body equal expectedResult
    expect(existShortUrl).toEqual(expectedResultExistUrl.shortUrlId);

    expect(existCreationTime).toEqual(expectedResultExistUrl.creationDate);
  });

  it("Should get a new url and add his object to the database", async () => {
    let DBLengthBeforePost = DB.urlData.length;
    const response = await request(app).post("/api/shorturl/new").send(newUrl);

    expect(DB.urlData.length).not.toBe(DBLengthBeforePost);
  });
});

// tests for ShortUrl GET route
describe("ShortUrl GET route", () => {
  afterAll(async () => {
    fsPromise.writeFile(
      `./database/test.json`,
      JSON.stringify([expectedResultExistUrl], null, 4)
    );
  });
  it("Should get short url and redirect to original url", async () => {
    const response = await request(app).get("/api/shorturl/1614871697604");
    // Is the status code 302
    expect(response.status).toBe(302);

    expect(response.header.location).toEqual(
      expectedResultExistUrl.originalUrl
    );
  });

  it("Should get short url not in Format and return error 400", async () => {
    const response = await request(app).get("/api/shorturl/abcdef");

    expect(response.status).toBe(400);

    expect(response.body).toEqual(messageNotFormat);
  });

  it("Should get short url that does not exist and return status 404 error", async () => {
    const response = await request(app).get("/api/shorturl/1614871123604");

    expect(response.status).toBe(404);

    expect(response.body).toEqual(messageNotFound);
  });
});

//tests for Statistic Get route
describe("Statistic Get route", () => {
  afterAll(async () => {
    fsPromise.writeFile(
      `./database/test.json`,
      JSON.stringify([expectedResultExistUrl], null, 4)
    );
  });
  it("Should get a short url and return url data object statistic ", async () => {
    const response = await request(app).get("/api/statistic/1614871697604");
    // Is the status code 200
    expect(response.status).toBe(200);

    // Is the body equal expectedResult
    expect(response.body).toEqual(expectedResultExistUrl);
  });

  it("Should get short url that does not exist and return status 404 error", async () => {
    const response = await request(app).get("/api/statistic/12334");

    expect(response.status).toBe(404);

    expect(response.body).toEqual(messageNotExist);
  });
});
