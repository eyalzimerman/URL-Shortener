const fsPromise = require("fs/promises");
const axios = require("axios").default;
let useDataBase;
process.env.NODE_ENV === "test"
  ? (useDataBase = "test")
  : (useDataBase = "database");

const ROOT = "https://api.jsonbin.io/b/";
const API_KYES = "$2b$10$3c8HlT7Mkm6Fmhp4/y0UveKGq8qFaFdTiTNKewqhEuXpQ9l7Itxdm";
const binID = "6043c2e8683e7e079c4660ac";
const headers = {
  header: {
    "Content-Type": "application/json",
    "X-Master-Key": API_KYES,
  },
};

// DataBase Class
class DataBase {
  constructor() {
    this.urlData = [];
    getDataFromJSON().then((res) => {
      this.urlData = res;
      if (!res) {
        getFromJSONBIN().then((data) => {
          this.urlData = data;
        });
      }
    });
  }

  // add url method
  addUrl(url) {
    const newUrl = new Url(url);
    this.urlData.push(newUrl);
    setToJSONBIN(this.urlData);
    const data = JSON.stringify(this.urlData, null, 4);
    return fsPromise
      .writeFile(`./database/${useDataBase}.json`, data)
      .then((res) => {
        return newUrl;
      });
  }

  // check if url or short url is exist
  isExist(url, typeUrl) {
    return fsPromise
      .readFile(`./database/${useDataBase}.json`)
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
        setToJSONBIN(this.urlData);
        fsPromise
          .writeFile(
            `./database/${useDataBase}.json`,
            JSON.stringify(data, null, 4)
          )
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

// Get data from JSON File
function getDataFromJSON() {
  return fsPromise.readFile(`./database/${useDataBase}.json`).then((res) => {
    const allData = JSON.parse(res);
    return allData;
  });
}

// set to JSONBIN.io
function setToJSONBIN(urls) {
  axios
    .put(`${ROOT}${binID}`, urls, headers)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
}

//get data from JSONBIN.io
function getFromJSONBIN() {
  axios
    .get(`${ROOT}${binID}/latest`, headers)
    .then((res) => {
      return res.data.record;
    })
    .catch((error) => {
      return;
    });
}

module.exports = DataBase;
