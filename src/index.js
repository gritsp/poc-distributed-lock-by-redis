const express = require("express");
const app = express();
const { likeById, getLikes, retryLikeWithLock } = require("./likePicture");
require("./redisConfig");

app.patch("/like/:id", async (req, res) => {
  const likes = await likeById(req.params.id);
  res.send("Liked picture with id 1" + likes);
});

app.get("/likeWithLock/:id", async (req, res) => {
  const likes = await retryLikeWithLock(req.params.id);
  console.log({ likes });
  res.send("Liked picture with id 1" + likes);
});

app.get("/like/:id", async (req, res) => {
  const likes = await getLikes(req.params.id);
  res.send({ likes });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
