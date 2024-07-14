const { client, redlock } = require("./redisConfig");

const likeById = async (id) => {
  setTimeout(() => {
    console.log(`delay: 1000 ms`);
  }, 1000);
  try {
    const likes = await client.get(`likes:${id}`);
    if (likes === null) {
      await client.set(`likes:${id}`, 1);
      return 1;
    }
    await client.set(`likes:${id}`, parseInt(likes) + 1);
    return parseInt(likes) + 1;
  } catch (error) {
    console.error("Error acquiring lock:", error);
  }
};

const likeByIdWithLock = async (id) => {
  const lock = await acquireLock(id);
  try {
    return await likeById(id);
  } catch (error) {
    console.error("Error liking picture with id:", error);
  } finally {
    await releaseLock(lock);
  }
};

const acquireLock = async (id) => {
  try {
    const lock = await redlock.acquire(`locks:${id}`, 1000);
    return lock;
  } catch (error) {
    console.error("Error acquiring lock:", error);
  }
};

const releaseLock = async (lock) => {
  try {
    await lock.release();
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

module.exports = { likeById, likeByIdWithLock, getLikes };
