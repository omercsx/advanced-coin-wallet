import axios from "axios";
//http://localhost:8182
export default axios.create({
  baseURL: "https://coin-wallet.onrender.com/api",
  withCredentials: true,
});
