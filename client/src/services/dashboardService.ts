import axios from "axios";

export const getDashboardStats = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("/api/dashboard/stats", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getRecentActivities = async (user_id: number) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    `/api/dashboard/recent-activities?user_id=${user_id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getRecentActivitiesStudent = async (user_id: number) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    `/api/dashboard/recent-activities-student?user_id=${user_id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
