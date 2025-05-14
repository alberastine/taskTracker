import axios from "./axios";
import { Task } from "../models/User";

interface UpdatedTask {
  taskName: string;
  dateStarted: string;
  deadline: string;
  status: string;
}

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

  updateTask: async (taskId: string, TaskData: UpdatedTask) => {
    try {
      const response = await axios.put(`/updateTask/${taskId}`, TaskData);
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
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
