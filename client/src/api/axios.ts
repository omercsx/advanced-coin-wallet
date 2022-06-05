import axios from "axios";
//http://localhost:8182
export default axios.create({
  baseURL: "http://localhost:8182/api",
  withCredentials: true,
});
