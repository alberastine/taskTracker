import axios from "../api/axios";

export const getUserTeams = async () => {
  const response = await axios.get("/user-teams", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data.teams;
};
