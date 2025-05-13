import axios from "./axios";
import { Task } from "../models/User";

export const taskApi = {
  addTask: async (TaskData: Task) => {
    try {
      const response = await axios.post("/addTask", TaskData);
      return response.data;
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  },
  deleteTask: async (taskId: string) => {
    try {
      const response = await axios.delete(`/deleteTask/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },
  getAllTasks: async () => {
    try {
      const response = await axios.get("/tasks");
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },
};
