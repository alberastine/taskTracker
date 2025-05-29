import { TeamTask } from "../models/Team";
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

export const addTeamTask = async (team_id: string, task: TeamTask) => {
  const response = await axios.post("/addTeamTask", {
    team_id,
    task: [task],
  });
  return response.data;
};

export const updateAssignTo = async (team_id: string, task_id: string, assign_to: string) => {
  const response = await axios.put("/updateAssignTo", {
    team_id,
    task_id,
    assign_to,
  });
  return response.data;
}

export const sendTeamInvitation = async (
  team_id: string,
  invited_user_id: string,
) => {
  const response = await axios.post("/inviteMember", {
    team_id,
    invited_user_id,
  });
  return response.data;
};

export const respondToInvitation = async (team_id: string, accept: boolean) => {
  const response = await axios.post("/respondToInvitation", {
    team_id,
    accept,
  });
  return response.data;
};

export const requestToJoinTeam = async (team_id: string) => {
  const response = await axios.post("/requestToJoinTeam", { team_id });
  return response.data;
};

export const respondToJoinRequest = async (
  team_id: string,
  user_id: string,
  accept: boolean,
) => {
  const response = await axios.post("/respondToJoinRequest", {
    team_id,
    user_id,
    accept,
  });
  return response.data;
};

export const leaveTeam = async (team_id: string) => {
  const response = await axios.post("/leaveTeam", { team_id });
  return response.data;
};

export const deleteTeam = async (team_id: string) => {
  const response = await axios.delete("/deleteTeam", {
    data: { team_id },
  });
  return response.data;
};
