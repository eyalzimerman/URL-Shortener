const fsPromise = require("fs/promises");

// DataBase Class
class DataBase {
  constructor() {
    this.urlData = [];
  }

  addUrl(url) {
    const newUrl = new Url(url);
    this.urlData.push(newUrl);
    const data = JSON.stringify(this.urlData, null, 4);
    return fsPromise.writeFile("./database/database.json", data).then((res) => {
      return newUrl;
    });
  }

  isExist(url) {
    return fsPromise
      .readFile("./database/database.json")
      .then((res) => {
        let allData = JSON.parse(res);
        let currentUrl = allData.find((urlElement) => {
          if (urlElement.originalUrl === url) {
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

  findOriginalUrl(shorturl) {
    return fsPromise
      .readFile("./database/database.json")
      .then((data) => {
        let allData = JSON.parse(data);
        let currentShortUrl = allData.find((urlElement) => {
          if (urlElement.shortUrlId === shorturl) {
            return true;
          }
        });
        if (currentShortUrl) {
          return currentShortUrl;
        }
        throw new Error();
      })
      .catch((e) => {
        return;
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
