// const { client, redlock } = require("./redisConfig");
const client = require("./redis");

const likeById = async (id) => {
  setTimeout(() => {}, 50);
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

const retryLikeById = async (id) => {
  const MAX_RETRIES = 5;
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      return await likeByIdWithLock(id);
    } catch (error) {
      console.error("retry:", error, retries);
      retries++;
    }
  }
};

const likeByIdWithLock = async (id) => {
  try {
    const lock = await acquireLock(id);
    if (!lock) {
      throw new Error("Failed to acquire lock");
    }
    return await likeById(id);
  } catch (error) {
    console.error("Error liking picture with id:", error);
    throw error;
  } finally {
    releaseLock(id);
  }
};

const acquireLock = async (id) => {
  try {
    const lock = await client.SETNX(`locks:${id}`, "1", (err, res) => {
      if (err) {
        console.error("Error acquiring lock:", err);
      }
      return res;
    });
    await client.EXPIRE(`locks:${id}`, 1000);
    console.log("Lock acquired:", lock);
    return lock;
  } catch (error) {
    console.error("Error acquiring lock:", error);
  }
  // try {
  //   const lock = await redlock.acquire(`locks:${id}`, 1000);
  //   return lock;
  // } catch (error) {
  //   console.error("Error acquiring lock:", error);
  // }
};

const releaseLock = async (id) => {
  try {
    // await lock.release();
    await client.DEL(`locks:${id}`);
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

module.exports = { likeById, likeByIdWithLock, getLikes, retryLikeById };
