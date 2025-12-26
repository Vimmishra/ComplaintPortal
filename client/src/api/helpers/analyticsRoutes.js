import axios from "axios";

export const fetchAnalytics = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/stats`);
  return res.data;
};
