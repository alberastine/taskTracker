import axios from "./axios";

interface UpdateUserData {
  username?: string;
  gmail?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const userApi = {
  getUserProfile: async () => {
    try {
      const response = await axios.get("/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await axios.get("/allUserInfo");
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },

  updateUser: async (updateData: UpdateUserData) => {
    try {
      const response = await axios.put("/updateUser", updateData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  updateProfilePicture: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      const response = await axios.post("/uploadProfilePicture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating profile picture:", error);
      throw error;
    }
  },

  updateCoverPicture: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("coverPic", file);

      const response = await axios.post("/uploadCoverPicture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating cover picture:", error);
      throw error;
    }
  },

  getUserById: async (userId: string) => {
    try {
      const response = await axios.get(`/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  loginUser: async (credentials: { gmail: string; password: string }) => {
    try {
      const response = await axios.post("/login", credentials);
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  registerUser: async (userData: {
    username: string;
    gmail: string;
    password: string;
  }) => {
    try {
      const response = await axios.post("/signup", userData);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  logoutUser: async () => {
    try {
      const response = await axios.post("/logout");
      return response.data;
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  },
};
