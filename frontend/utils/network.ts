import axios from "axios";

const API_URL = "http://localhost:3001";

const Post = async (data, url) => {
  const response = await axios.put(`${API_URL}${url}`, data);
  return response;
};

const Get = async (url) => {
  const response = await axios.get(`${API_URL}${url}`);
  return response;
};

export { Post, Get };
