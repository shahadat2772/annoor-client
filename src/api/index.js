import axios from "axios";

const fetcher = axios.create({
  baseURL: "https://annoor-server-production-af32.up.railway.app/",
});

export default fetcher;
