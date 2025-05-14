import axios from "../api/axios";

export const getUserTeams = async () => {
  const response = await axios.get("/user-teams", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data.teams;
};

export const createTeam = async (teamName: string) => {
  const response = await axios.post("/createTeam", { team_name: teamName });
  return response.data;
};

export const sendTeamInvitation = async (team_id: string, invited_user_id: string) => {
  const response = await axios.post('/inviteMember', { team_id, invited_user_id });
  return response.data;
};

export const respondToInvitation = async (team_id: string, accept: boolean) => {
  const response = await axios.post('/respondToInvitation', { team_id, accept });
  return response.data;
};

export const requestToJoinTeam = async (team_id: string) => {
  const response = await axios.post('/requestToJoinTeam', { team_id });
  return response.data;
};

export const respondToJoinRequest = async (team_id: string, user_id: string, accept: boolean) => {
  const response = await axios.post('/respondToJoinRequest', { team_id, user_id, accept });
  return response.data;
};
