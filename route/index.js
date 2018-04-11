/*
 * @Author: jiapeng.Zheng 
 * @Date: 2018-04-11 09:13:19 
 * @Last Modified by: jiapeng.Zheng
 * @Last Modified time: 2018-04-11 11:50:50
 * @description: 自动路由
 *  1、遍历当前目录下除去本身(route\index.js)外的所有路由文件；
 *  2、修正路由文件的path，以route目录层级为path的路径，
 *     即route\api\userinfo.js的path为 /api/userinfo + 该文件的path；
 *  3、重新定义各个路由文件中参数验证（config.validate）中的错误回调failAction，
 *     若本身存在config.validate.failAction,则忽略以下规则，否则，
 *     a、修改http头的Status Code，
 *     b、用自定义的返回参数覆盖hapi自带的error、statusCode、message字段
 */
const path = require("path");
const _ = require("lodash");
const util = require(path.resolve("./common/util"));

const routeFiles = util.fileDisplay(__dirname);
let routeList = [];

routeFiles.forEach(routeFilePath => {
  if (routeFilePath === path.join(__dirname, "./index.js")) {
    return;
  } else {
    let route = require(routeFilePath);
    // 修正hapi route中的path，规定以route目录为path的路径
    route.path =
      routeFilePath
        .replace(__dirname, "")
        .split(path.sep)
        .join("/")
        .replace(/.js$/g, "") + route.path;
    // 重新定义hapi route参数验证中的错误回调failAction
    let route_config_validate = {
      failAction: function(request, h, err) {
        return util.failActionReturnFormat(ERR.message);
      }
    };
    if (route.config) {
      route.config.validate = _.extend(route_config_validate, route.config.validate);
    } else {
      route.config = {validate:route_config_validate};
    }
    routeList.push(route);
  }
});
module.exports = routeList;
