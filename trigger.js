const axios = require("axios");

const likeById = async (id) => {
  const response = axios.patch(`http://localhost:3000/like/${id}`);
  return response.data;
};

const likeByIdWithLock = async (id) => {
  const response = axios.get(`http://localhost:3000/likeWithLock/${id}`);
  return response.data;
};

const loop = (id1, id2, total) => {
  for (let i = 0; i < total; i++) {
    likeById(id1);
    likeByIdWithLock(id2);
  }
  console.log("Done");
};

loop(1, 2, 100);
