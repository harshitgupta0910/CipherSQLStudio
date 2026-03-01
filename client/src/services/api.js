import axios from "axios";

const API_BASE = "https://ciphersqlstudio-gfa3.onrender.com";

const getToken = () => localStorage.getItem("css_token");

const authAxios = () =>
  axios.create({
    baseURL: API_BASE,
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const registerUser = async (name, email, password) => {
  const response = await axios.post(`${API_BASE}/api/auth/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_BASE}/api/auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const getAssignments = async () => {
  const response = await axios.get(`${API_BASE}/api/assignments`);
  return response.data;
};

export const getAssignmentById = async (id) => {
  const response = await axios.get(`${API_BASE}/api/assignments/${id}`);
  return response.data;
};

export const executeQuery = async (query) => {
  const response = await axios.post(`${API_BASE}/api/execute`, { query });
  return response.data;
};

export const getHint = async (question, userQuery) => {
  const response = await axios.post(`${API_BASE}/api/hint`, {
    question,
    userQuery,
  });
  return response.data;
};

export const saveAttempt = async (assignmentId, query, status, errorMessage, rowCount) => {
  const response = await authAxios().post(`/api/attempts`, {
    assignmentId,
    query,
    status,
    errorMessage,
    rowCount,
  });
  return response.data;
};

export const getAttempts = async (assignmentId) => {
  const response = await authAxios().get(`/api/attempts/${assignmentId}`);
  return response.data;
};

