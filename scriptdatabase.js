const fs = require("fs");

class DataBase {
  constructor() {
    this.urlData = [];
  }

  addUrl(url) {
    this.urlData.push(new Url(url));
    fs.writeFile(
      "./database/database.json",
      JSON.stringify(this.urlData, null, 4)
    ).then((res) => {
      console.log(this.urlData);
    });
  }

  isExist() {}
}

class Url {
  constructor(originalUrl) {
    this.originalUrl = originalUrl;
    this.shortUrlId = Date.now();
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
