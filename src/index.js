const express = require("express");
const app = express();
const {
  likeById,
  likeByIdWithLock,
  getLikes,
  retryLikeById,
} = require("./likePicture");
const client = require("./redis");

app.patch("/like/:id", async (req, res) => {
  const likes = await likeById(req.params.id);
  res.send("Liked picture with id 1" + likes);
});

app.get("/likeWithLock/:id", async (req, res) => {
  const likes = await retryLikeById(req.params.id);
  res.send("Liked picture with id 1" + likes);
});

app.get("/like/:id", async (req, res) => {
  const likes = await getLikes(req.params.id);
  res.send("Likes: " + likes);
});

app.listen(3000, async () => {
  await client.connect();
  console.log("Server is running on port 3000");
});
