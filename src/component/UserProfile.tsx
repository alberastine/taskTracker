import { RxAvatar } from "react-icons/rx";
import WidgetWrapper from "./WidgetWrapper";
import "../styles/components/UserProfile.css";
import { Card } from "flowbite-react";
import { Button, Form } from "antd";
import { PieChart } from "@mui/x-charts/PieChart";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { Input } from "antd";
import axios from "../api/axios";

type TaskStatus = "Completed" | "Ongoing" | "Late";

const UserProfile = ({
  setActiveWidget,
}: {
  setActiveWidget: (key: number) => void;
}) => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [allUsers, setAllUsers] = useState<{ _id: string; username: string }[]>([]);

  const { user } = useContext(UserContext);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/allUserInfo");
      setAllUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
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

  return (
    <WidgetWrapper>
      <div className="user-profile-container ">
        <div className="user-profile-left dark:bg-gray-800">
          <div className="user-profile-header">
            <div className="user-profile-header-info">
              <div className="relative">
                <RxAvatar size={120} className="rounded-full bg-gray-100" />
                {editingProfile && (
                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-2 right-2 cursor-pointer"
                  >
                    <div className="rounded-full bg-blue-500 p-1 text-white hover:bg-blue-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                    <input
                      id="profile-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                )}
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
              .map((filteredUser: { _id: string; username: string }) => (
                <div
                  key={filteredUser._id}
                  className="mb-2 flex items-start gap-2"
                >
                  <RxAvatar size={40} className="rounded-full bg-gray-100" />
                  <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {filteredUser.username}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </WidgetWrapper>
  );
};

export default UserProfile;
