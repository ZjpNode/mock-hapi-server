"use strict";
const path = require("path");
const Hapi = require("hapi");
const util = require(path.resolve("./common/util"));
const routeList = require("./route");

const server_config = util.getConfig("server");

const server = Hapi.server({
  port: server_config.port,
  host: server_config.host
});

const init = async () => {
  // 注册第三方插件
  await server.register([
    {
      plugin: require("hapi-pino"),
      options: {
        prettyPrint: false,
        logEvents: ["response"]
      }
    },
    require("hapi-auth-cookie")
  ]);

  // 缓存设置
  const cache = server.cache({
    segment: "sessions",
    expiresIn: server_config.cache_expires
  });
  server.app.cache = cache;
  // 设置hapi的策略
  server.auth.strategy("session", "cookie", {
    password: server_config.cookie_psw,
    cookie: server_config.cookie_key,
    redirectTo: server_config.redirectTo,
    isSecure: false,  // 正式环境必须改为true
    validateFunc: async (request, session) => {
      const cached = await cache.get(session.sid);
      const out = {
        valid: !!cached
      };

      if (out.valid) {
        out.credentials = cached.account;
      }

      return out;
    }
  });
  server.auth.default("session");

  // 加载路由
  server.route(
    routeList.concat([
      {
        method: "GET",
        path: "/",
        handler: (request, h) => {
          return "Hello, world!";
        }
      }
    ])
  );

  // 启动服务
  await server.start();

  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
