import { RxAvatar } from "react-icons/rx";
import WidgetWrapper from "./WidgetWrapper";
import "../styles/components/UserProfile.css";
import { Card } from "flowbite-react";
import { Button, Form, Modal } from "antd";
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
  }, []);

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

  const handleCancel = () => {
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

  return (
    <WidgetWrapper>
      <div className="user-profile-container ">
        <div className="user-profile-left dark:bg-gray-800">
          <div className="user-profile-header">
            <div className="user-profile-header-info">
              <div className="relative border-gray-300 object-cover">
                {user.profilePic ? (
                  <img
                    src={
                      user.profilePic
                        ? `http://localhost:5000${user.profilePic}`
                        : "/default-avatar.png"
                    }
                    alt="Profile"
                    className="size-[120px] rounded-full border-2 border-gray-300 object-cover p-1"
                  />
                ) : (
                  <RxAvatar size={120} className="rounded-full bg-gray-100" />
                )}
                <div
                  onClick={showModal}
                  className="absolute bottom-2 right-2 cursor-pointer rounded-full bg-blue-500 p-1 text-white hover:bg-blue-300"
                >
                  <CameraOutlined style={{ fontSize: "20px" }} />
                </div>
              </div>
              <div className="user-profile-info">
                <div>
                  <h2 className="dark:text-white">{user.username}</h2>
                  <p>{user.gmail}</p>
                </div>
                <div className="mb-3">
                  <span className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Total tasks: {totalTasks}
                  </span>
                </div>
              </div>
            </div>

            <div className="user-profile-info-buttons">
              {editingProfile ? (
                <Button
                  color="danger"
                  variant="outlined"
                  onClick={onClickCancelChanges}
                >
                  Cancel
                </Button>
              ) : (
                <Button onClick={onClickEditProfile}>Edit Profile</Button>
              )}
            </div>
          </div>
          <div className="user-profile-body-container">
            {editingProfile && (
              <>
                <Form
                  layout="horizontal"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  style={{ maxWidth: 600 }}
                  initialValues={{ remember: true }}
                  onFinish={onClickSaveChanges}
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

                  <Button htmlType="submit" onClick={onClickEditProfile}>
                    Save Changes
                  </Button>
                </Form>
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
              overflow: "auto",
            }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between bg-white py-4 dark:bg-gray-800">
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
            {user.tasks.map((task, index) => (
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
                    {filteredUser.profilePic ? (
                      <img
                        src={
                          filteredUser.profilePic
                            ? `http://localhost:5000${filteredUser.profilePic}`
                            : ""
                        }
                        className="size-10 rounded-full border-2 border-gray-300 object-cover"
                      />
                    ) : (
                      <RxAvatar
                        size={40}
                        className="rounded-full bg-gray-100"
                      />
                    )}
                    <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
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
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            color="primary"
            variant="outlined"
            onClick={handleSubmitProfile}
            disabled={!file}
          >
            Save
          </Button>,
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
    </WidgetWrapper>
  );
};

export default UserProfile;
