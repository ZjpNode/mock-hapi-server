/*
 * @Author: jiapeng.Zheng 
 * @Date: 2018-04-11 09:23:50 
 * @Last Modified by: jiapeng.Zheng
 * @Last Modified time: 2018-04-11 17:58:23
 * @description: 登入api
 */
const path = require("path");
const Joi = require("Joi");
const util = require(path.resolve("./common/util"));

const USER = util.getConfig("user")["user"];
const FIELD_MAPPING = {
  username: "用户名",
  password: "密码"
};

let uuid = 1; // Use seq instead of proper unique identifiers for demo only

module.exports = {
  method: "POST",
  path: "",
  handler: async (request, h) => {
    // request.payload
    let username = request.payload.username;
    let password = request.payload.password;
    let msg = util.responseFormat(true, "登陆成功");
    if (!request.auth.isAuthenticated) {
      if (!USER[username]) {
        msg = util.responseFormat(false, "用户不存在");
      } else if (USER[username].password !== password) {
        msg = util.responseFormat(false, "密码出错");
      } else {
        const sid = String(++uuid);
        await request.server.app.cache.set(sid, { account: USER[username] }, 0);
        request.cookieAuth.set({ sid });
      }
    }
    return msg;
  },
  config: {
    auth: { mode: "try" },
    plugins: { "hapi-auth-cookie": { redirectTo: false } },
    validate: {
      payload: {
        username: Joi.string().required(),
        password: Joi.string().required()
      },
      failAction: function(request, h, err) {
        let errType = err.details[0].type;
        let errField = err.details[0].context.key;
        let error = util.failActionReturnFormat(`【${errType}】${err.message}`);
        if (errType === "any.required") {
          error = util.failActionReturnFormat(
            `${FIELD_MAPPING[errField]}不能为空`
          );
        } else if (errType === "number.base") {
          error = util.failActionReturnFormat(
            `${FIELD_MAPPING[errField]}必须为数字`
          );
        }
        return error;
      }
    }
  }
};
