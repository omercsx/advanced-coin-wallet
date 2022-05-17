import axios from "axios";

export default axios.create({
  baseURL: "https://advanced-coin-wallet-f4nvx.ondigitalocean.app/api",
  withCredentials: true,
});
