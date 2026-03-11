import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/* ================= TODOS ================= */

export const getTodos = (userId) =>
  API.get(`/todos/user/${userId}`);

export const createTodo = (todo) =>
  API.post("/todos", todo);

export const deleteTodo = (id) =>
  API.delete(`/todos/${id}`);

export const updateTodo = (id, updatedTodo) =>
  API.put(`/todos/${id}`, updatedTodo);


/* ================= AUTH ================= */

export const registerUser = async (userData) => {
  const res = await API.post("/auth/register", userData);
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await API.post("/auth/login", {
    email,
    password
  });
  return res.data;
};
export const updateUser = async (id, userData) => {
  const res = await API.patch(`/users/${id}`, userData);
  return res.data;
};

export default API;