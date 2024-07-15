const redis = require("redis");

let client;

function getClient() {
  if (!client) {
    client = redis.createClient({
      host: "localhost",
      port: 6379,
    });

    client.on("connect", () => {
      console.log("Connected to Redis...");
    });

    client.on("error", (err) => {
      console.error("Redis error: ", err);
    });

    // Optionally handle the client close event
    client.on("end", () => {
      console.log("Redis client disconnected");
    });
  }

  return client;
}

module.exports = getClient();
