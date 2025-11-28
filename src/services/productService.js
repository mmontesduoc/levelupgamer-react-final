import axios from "axios";

const API_URL = "http://localhost:8080/api/products";

export const getProductsByCategory = async (categoryId) => {
  const res = await axios.get(`${API_URL}/category/${categoryId}`);
  return res.data;
};
