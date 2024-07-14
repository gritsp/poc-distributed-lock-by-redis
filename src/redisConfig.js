const Redis = require("ioredis");
const { default: Redlock } = require("redlock");

const client = new Redis({
  host: "localhost",
  port: 6379,
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

const redlock = new Redlock([client], {
  retryCount: 10,
  retryDelay: 200,
});

redlock.on("clientError", (err) => {
  console.error("A Redis error has occurred:", err);
});

client.on("connect", () => {
  console.log("Redis connected");
});

module.exports = { client, redlock };
