
import { Form, Modal, Button, message } from "antd";
import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { UserContext } from "../../context/userContext";
import { Input } from "antd";
import axios from "../../api/axios";

import { AxiosError } from "axios";
import { CameraOutlined } from "@ant-design/icons";
import { userApi } from "../../api/userApi";

import ProgressChart from "./ProgressChart";
import LatestTasks from "./LatestTasks";
import WidgetWrapper from "../WidgetWrapper";
import "../../styles/components/UserProfile.css";
interface UpdateUserData {
  username?: string;
  gmail?: string;
  currentPassword?: string;
  newPassword?: string;
}

const UserProfile = ({
  setActiveWidget,
}: {
  setActiveWidget: (key: number) => void;
}) => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [allUsers, setAllUsers] = useState<{ _id: string; username: string }[]>(
    [],
  );
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenCoverpic, setIsModalOpenCoverpic] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { user, setUser } = useContext(UserContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get("/profile");
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    }
  }, [setUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse] = await Promise.all([
          userApi.getAllUsers(),
          fetchUser(),
        ]);
        setAllUsers(usersResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [fetchUser]);

  if (!user) {
    return <div>User not found</div>;
  }

  const totalTasks = user.tasks.length;

  const onClickEditProfile = () => {
    setEditingProfile(true);
  };

  const onClickCancelChanges = () => {
    setEditingProfile(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showModalCoverpic = () => {
    setIsModalOpenCoverpic(true);
  };

  const handleCancel = () => {
    setIsModalOpenCoverpic(false);
    setIsModalOpen(false);
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
    }
  };

  const handleSubmitProfile = async () => {
    if (!file) return;

    try {
      await userApi.updateProfilePicture(file);
      await fetchUser();

      setIsModalOpen(false);
      setFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleSubmitCoverPic = async () => {
    if (!file) return;

    try {
      await userApi.updateCoverPicture(file);
      await fetchUser();

      setIsModalOpenCoverpic(false);
      setFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleUpdateUser = async (values: UpdateUserData) => {
    try {
      const updateData = {
        username: values.username,
        gmail: values.gmail,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword || undefined,
      };

      await userApi.updateUser(updateData);
      await fetchUser();
      setEditingProfile(false);
      message.success("Profile updated successfully");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      if (error.response) {
        if (error.response.status === 401) {
          message.error("Current password is incorrect");
        } else if (error.response.data?.message) {
          message.error(error.response.data.message);
        } else {
          message.error("Failed to update profile");
        }
      } else {
        message.error("Network error or server is unreachable");
      }
    }
  };

  return (
    <WidgetWrapper>
      <div className="user-profile-container ">
        <div className="user-profile-left dark:bg-gray-800">
          <div className="user-profile-header-container">
            <div className="cover-photo relative">
              {user.coverPic ? (
                <img
                  src={
                    user.coverPic
                      ? `http://localhost:5000${user.coverPic}`
                      : "/default-avatar.png"
                  }
                  alt="Profile"
                  className="size-full rounded object-cover"
                />
              ) : (
                <div className="cover-photo-alt">No Cover Photo Uploaded</div>
              )}
              <div
                onClick={showModalCoverpic}
                className="absolute bottom-2 right-2 z-10 flex cursor-pointer items-center justify-center gap-1 rounded-full border-2 bg-blue-500 p-1 text-white hover:bg-blue-300"
              >
                <CameraOutlined style={{ fontSize: "15px" }} />
                <p style={{ fontSize: "10px" }}>Edit cover photo</p>
              </div>
            </div>
            <div className="user-profile-header">
              <div className="user-profile-header-info">
                <div className="relative border-gray-300 object-cover">
                  <div>
                    {user.profilePic ? (
                      <img
                        src={
                          user.profilePic
                            ? `http://localhost:5000${user.profilePic}`
                            : "/default-avatar.png"
                        }
                        alt="Profile"
                        className="size-[120px] rounded-full border-4 border-white object-cover"
                      />
                    ) : (
                      <div className="user-profile-avatar">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div
                      onClick={showModal}
                      className="absolute bottom-1 right-1 flex size-7 cursor-pointer items-center justify-center rounded-full border-2 bg-blue-500 p-1 text-white hover:bg-blue-300"
                    >
                      <CameraOutlined style={{ fontSize: "15px" }} />
                    </div>
                  </div>
                </div>
                <div className="user-profile-info">
                  <div>
                    <h2 className="text-lg font-semibold dark:text-white">
                      {user.username}
                    </h2>
                    <p>{user.gmail}</p>
                  </div>
                </div>
              </div>

              <div className="user-profile-info-buttons">
                {editingProfile ? (
                  <Button
                    onClick={onClickCancelChanges}
                    className="button-no-focus"
                    style={{ backgroundColor: "red", color: "white" }}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    onClick={onClickEditProfile}
                    className="button-no-focus"
                    style={{
                      backgroundColor: "rgb(14 116 144)",
                      color: "white",
                    }}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <span className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Total tasks: {totalTasks}
            </span>
          </div>
          <div className="user-profile-body-container">
            {editingProfile && (
              <>
                <Form
                  layout="horizontal"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 16 }}
                  style={{ maxWidth: 600 }}
                  autoComplete="off"
                  onFinish={handleUpdateUser}
                  initialValues={{
                    username: user.username,
                    gmail: user.gmail,
                  }}
                >
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        min: 3,
                        message: "Username must be at least 3 characters",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="gmail"
                    rules={[
                      {
                        type: "email",
                        message: "Please enter a valid email!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item label="Current Password" name="currentPassword">
                    <Input.Password visibilityToggle={true} />
                  </Form.Item>
                  <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[
                      {
                        min: 6,
                        message: "Password must be at least 6 characters",
                      },
                    ]}
                  >
                    <Input.Password visibilityToggle={true} />
                  </Form.Item>
                  <div className="flex justify-end">
                    <Button
                      className="button-no-focus"
                      htmlType="submit"
                      style={{
                        backgroundColor: "rgb(14 116 144)",
                        color: "white",
                      }}
                    >
                      Save Changes
                    </Button>
                  </div>
                </Form>
              </>
            )}
          </div>
        </div>
        <div className="user-profile-right">
          <LatestTasks setActiveWidget={setActiveWidget} />
          <ProgressChart />
        </div>
        <div className="collaborate-with">
          <h5 className="pb-4 text-xl font-bold leading-none text-gray-900 dark:text-white">
            Collaborate with
          </h5>
          <div>
            {allUsers
              .filter((otherUser) => otherUser._id !== user._id)
              .map(
                (filteredUser: {
                  _id: string;
                  username: string;
                  profilePic?: string;
                }) => (
                  <div
                    key={filteredUser._id}
                    className="mb-2 flex items-start gap-2"
                  >
                    <span className="collaborate-with-avatar flex size-10 items-center justify-center">
                      {filteredUser.profilePic ? (
                        <img
                          src={
                            filteredUser.profilePic
                              ? `http://localhost:5000${filteredUser.profilePic}`
                              : ""
                          }
                          className="size-10 rounded-full border-2 border-gray-300 object-cover"
                          alt={`${filteredUser.username}'s avatar`}
                        />
                      ) : (
                        filteredUser.username.charAt(0).toUpperCase()
                      )}
                    </span>
                    <span className="mt-1 items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                      {filteredUser.username}
                    </span>
                  </div>
                ),
              )}
          </div>
        </div>
      </div>
      <Modal
        title="Upload Profile Picture"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <div className="displayflex-flexend">
            <Button
              key="cancel"
              className="button-no-focus"
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button
              key="submit"
              className="button-no-focus"
              onClick={handleSubmitProfile}
              disabled={!file}
            >
              Save
            </Button>
          </div>,
        ]}
      >
        <div className="flex flex-col items-center gap-4">
          {previewUrl && (
            <div className="size-32 overflow-hidden rounded-full">
              <img
                src={previewUrl}
                alt="Preview"
                className="size-full object-cover"
              />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            name="profilePic"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:rounded-full file:border-0
              file:bg-blue-50 file:px-4
              file:py-2 file:text-sm
              file:font-semibold file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
      </Modal>
      <Modal
        title="Upload Cover Picture"
        open={isModalOpenCoverpic}
        onCancel={handleCancel}
        footer={[
          <div className="displayflex-flexend">
            <Button
              key="cancel"
              className="button-no-focus"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              key="submit"
              className="button-no-focus"
              onClick={handleSubmitCoverPic}
              disabled={!file}
            >
              Save
            </Button>
          </div>,
        ]}
      >
        <div className="flex flex-col items-center gap-4">
          {previewUrl && (
            <div className="size-32 w-full overflow-hidden ">
              <img
                src={previewUrl}
                alt="Preview"
                className="size-full object-cover"
              />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            name="coverPic"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:rounded-full file:border-0
              file:bg-blue-50 file:px-4
              file:py-2 file:text-sm
              file:font-semibold file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
      </Modal>
    </WidgetWrapper>
  );
};

export default UserProfile;
