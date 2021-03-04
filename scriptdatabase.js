const fsPromise = require("fs/promises");

// DataBase Class
class DataBase {
  constructor() {
    this.urlData = [];
  }

  // add url method
  addUrl(url) {
    const newUrl = new Url(url);
    this.urlData.push(newUrl);
    const data = JSON.stringify(this.urlData, null, 4);
    return fsPromise.writeFile("./database/database.json", data).then((res) => {
      return newUrl;
    });
  }

  // check if url or short url is exist
  isExist(url, typeUrl) {
    return fsPromise
      .readFile("./database/database.json")
      .then((res) => {
        let allData = JSON.parse(res);
        let currentUrl = allData.find((urlElement) => {
          if (urlElement[typeUrl] === url) {
            return true;
          }
        });
        if (currentUrl) {
          return currentUrl;
        }
        throw new Error();
      })
      .catch((e) => {
        return;
      });
  }

  updateRedirectClicks(shortUrl) {
    this.isExist(shortUrl, "shortUrlId")
      .then((resUrl) => {
        const index = this.urlData.findIndex((matchUrl) => {
          if (matchUrl.shortUrlId === resUrl.shortUrlId) {
            return true;
          }
        });
        this.urlData[index].redirectCount++;
        return this.urlData;
      })
      .then((data) => {
        fsPromise
          .writeFile("./database/database.json", JSON.stringify(data, null, 4))
          .then((error) => {
            return error;
          });
      });
  }
}

// Url Class
class Url {
  constructor(originalUrl) {
    this.originalUrl = originalUrl;
    this.shortUrlId = `${Date.now()}`;
    this.redirectCount = 0;
    this.creationDate = this.getSQLDate(new Date());
  }
  getSQLDate(date) {
    return `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
}

module.exports = DataBase;
