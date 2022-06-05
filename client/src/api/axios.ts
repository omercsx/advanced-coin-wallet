import axios from "axios";
//http://localhost:8182
export default axios.create({
  baseURL: "https://advanced-coin-wallet-f4nvx.ondigitalocean.app/api",
  withCredentials: true,
});
