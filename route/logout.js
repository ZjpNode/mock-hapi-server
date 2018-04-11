/*
 * @Author: jiapeng.Zheng 
 * @Date: 2018-04-11 09:24:07 
 * @Last Modified by: jiapeng.Zheng
 * @Last Modified time: 2018-04-11 17:33:46
 * @description: 登出api
 */
const path = require("path");
const Joi = require("Joi");
const util = require(path.resolve(".", "./common/util"));
const cookie_key = util.getConfig("server").cookie_key;
module.exports = {
  method: "GET",
  path: "",
  handler: (request, h) => {
    request.server.app.cache.drop(request.state[cookie_key].sid);
    request.cookieAuth.clear();
    // return h.redirect('/');
    return util.responseFormat(true, "登出成功");
  }
};
