import WidgetWrapper from "./WidgetWrapper";
import "../styles/components/UserProfile.css";
import { Card } from "flowbite-react";
import { Form, Modal } from "antd";
import { Button } from "flowbite-react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../context/userContext";
import { Input } from "antd";
import axios from "../api/axios";
import { CameraOutlined } from "@ant-design/icons";

type TaskStatus = "Completed" | "Ongoing" | "Late";

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

  const fetchAllUser = async () => {
    try {
      const res = await axios.get("/allUserInfo");
      setAllUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get("/profile");
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllUser();
    fetchUser();
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const initialStatusCounts: Record<TaskStatus, number> = {
    Completed: 0,
    Ongoing: 0,
    Late: 0,
  };

  const statusCounts = user.tasks.reduce(
    (acc, task) => {
      if (["Completed", "Ongoing", "Late"].includes(task.status)) {
        acc[task.status as TaskStatus]++;
      }
      return acc;
    },
    { ...initialStatusCounts },
  );

  const totalTasks = user.tasks.length;

  const onClickEditProfile = () => {
    setEditingProfile(true);
  };

  const onClickSaveChanges = () => {
    setEditingProfile(false);
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

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      await axios.post("/uploadProfilePicture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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

    const formData = new FormData();
    formData.append("coverPic", file);

    try {
      await axios.post("/uploadCoverPicture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchUser();

      setIsModalOpenCoverpic(false);
      setFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
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
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    onClick={onClickEditProfile}
                    className="button-no-focus"
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
                  initialValues={{ remember: true }}
                  autoComplete="off"
                >
                  <Form.Item label="Username" name="username">
                    <Input defaultValue={user.username} />
                  </Form.Item>
                  <Form.Item label="Email" name="email">
                    <Input defaultValue={user.gmail} />
                  </Form.Item>
                  <Form.Item label="Password" name="password">
                    <Input.Password defaultValue={user.password} />
                  </Form.Item>
                  <Form.Item label="Confirm Password" name="confirmPassword">
                    <Input.Password defaultValue={user.password} />
                  </Form.Item>
                </Form>
                <div className="flex justify-end">
                  <Button
                    onClick={onClickSaveChanges}
                    className="button-no-focus"
                  >
                    Save Changes
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="user-profile-right">
          <Card
            className="max-w-sm"
            style={{
              border: "none",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              maxHeight: "18rem",
            }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between bg-white dark:bg-gray-800">
              <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                Latest Tasks
              </h5>
              <button
                onClick={() => setActiveWidget(1)}
                className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              >
                View all
              </button>
            </div>
            {[...user.tasks]
              .sort(
                (a, b) =>
                  new Date(b.dateStarted).getTime() -
                  new Date(a.dateStarted).getTime(),
              )
              .slice(0, 3)
              .map((task, index) => (
                <div
                  key={task.id || index}
                  className={`flow-root rounded-lg ${
                    task.status === "Completed"
                      ? "bg-[#A7F3D0]/70"
                      : task.status === "Ongoing"
                        ? "bg-[#D1D5DB]/70"
                        : task.status === "Late"
                          ? "bg-[#FCA5A5]/70"
                          : "bg-gray-50 dark:bg-gray-800"
                  }`}
                >
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    <li className="p-2 sm:py-2">
                      <div className="flex items-center space-x-4">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {task.taskName}
                          </p>
                          <p className="truncate text-sm text-gray-500">
                            {new Date(task.dateStarted).toLocaleDateString()} to{" "}
                            {new Date(task.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900">
                          {task.status}
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              ))}
          </Card>
          <Card
            className="max-w-sm"
            style={{
              border: "none",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              marginTop: "1rem",
              maxHeight: "17.7rem",
            }}
          >
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Progress Chart
            </h5>
            {user.tasks.length > 0 ? (
              <PieChart
                colors={["#A7F3D0", "#D1D5DB", "#FCA5A5"]}
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: statusCounts.Completed,
                        label: "Completed",
                      },
                      { id: 1, value: statusCounts.Ongoing, label: "Ongoing" },
                      { id: 2, value: statusCounts.Late, label: "Late" },
                    ],
                  },
                ]}
                width={200}
                height={200}
              />
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You have not added any tasks
              </p>
            )}
          </Card>
        </div>
        <div className="collaborate-with">
          <h5 className="py-4 text-xl font-bold leading-none text-gray-900 dark:text-white">
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
            <Button key="cancel" className="button-no-focus" onClick={handleCancel}>
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
