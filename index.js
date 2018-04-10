"use strict";

const routeList = require("./route");
const Hapi = require("hapi");

const server = Hapi.server({
  port: 3000,
  host: "localhost"
});

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

const init = async () => {
  await server.register({
    plugin: require("hapi-pino"),
    options: {
      prettyPrint: false,
      logEvents: ["response"]
    }
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
