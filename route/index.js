const path = require("path");
const util = require("../common/util");

const routeFiles = util.fileDisplay(__dirname);
let routeList = [];

routeFiles.forEach(routeFilePath => {
  if (routeFilePath === path.join(__dirname, "./index.js")) {
    return;
  } else {
    let route = require(routeFilePath);
    route.path =
      routeFilePath
        .replace(__dirname, "")
        .split(path.sep)
        .join("/")
        .replace(/.js$/g, "") + route.path;
    routeList.push(route);
  }
});
console.log(routeList);
module.exports = routeList;
