const { client } = require("./redisConfig");

const likeById = async (id) => {
  console.log(`Picture with id ${id} liked`);
  try {
    const likes = await client.get(`likes:${id}`);
    if (!likes) {
      await client.set(`likes:${id}`, 1);
      console.log(`Picture with id ${id} liked`);
      return 1;
    }
    await client.set(`likes:${id}`, parseInt(likes) + 1);
    console.log(`Picture with id ${id} liked: ${parseInt(likes) + 1}`);
    return parseInt(likes) + 1;
  } catch (error) {
    console.error("Error acquiring lock:", error);
  }
};

const likeByIdWithLock = async (id) => {
  try {
    const lock = await acquireLock(id);
    if (!lock) {
      console.log(`Failed to acquire lock for picture with id: ${id}`);
      return;
    }
    return await likeById(id);
  } catch (error) {
    console.error("Error liking picture with lock:", error);
  }
};

const retryLikeWithLock = async (id) => {
  while (true) {
    try {
      const likes = await likeByIdWithLock(id);
      if (likes !== undefined) {
        await releaseLock(id);
        return likes;
      }
    } catch (error) {
      console.error("Error liking picture with lock:", error);
    }
    setTimeout(() => {
      console.log(`Retrying to like picture with id ${id}`);
    }, 1000);
  }
};

const acquireLock = async (id) => {
  try {
    return await client.setnx(`locks:${id}`, "lock");
  } catch (error) {
    console.error("Error acquiring lock:", error);
  }
};

const releaseLock = (id) => {
  try {
    client.del(`locks:${id}`);
    console.log(`Released Lock for picture with id ${id} released`);
  } catch (error) {
    console.error("Error releasing lock:", error);
  }
};

const getLikes = async (id) => {
  try {
    const likes = await client.get(`likes:${id}`);
    return likes;
  } catch (error) {
    console.error("Error getting likes:", error);
  }
};

module.exports = { likeById, likeByIdWithLock, getLikes, retryLikeWithLock };
