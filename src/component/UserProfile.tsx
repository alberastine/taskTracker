import { RxAvatar } from "react-icons/rx";
import WidgetWrapper from "./WidgetWrapper";
import "../styles/components/UserProfile.css";
import { Card } from "flowbite-react";
import { PieChart } from "@mui/x-charts/PieChart";

import { useContext } from "react";
import { UserContext } from "../context/userContext";

type TaskStatus = "Completed" | "Ongoing" | "Late";

const UserProfile = ({
  setActiveWidget,
}: {
  setActiveWidget: (key: number) => void;
}) => {
  const { user } = useContext(UserContext);

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

  return (
    <WidgetWrapper>
      <div className="user-profile-container">
        <Card
          className="user-profile-left"
          style={{
            border: "none",
          }}
        >
          <div className="user-profile-header">
            <div>
              <RxAvatar size={200} />
              <div className="user-profile-info">
                <h2 className="dark:text-white">{user.username}</h2>
                <p>{user.gmail}</p>
              </div>
            </div>
          </div>
          <div className="user-profile-body-container">
            <div className="user-profile-body">
              <div className="user-profile-body-label">
                <p className="dark:text-white">Username</p>
              </div>
              <div className="user-profile-body-input-container">
                <input className="user-profile-body-input" />
              </div>
            </div>
            <div className="user-profile-body">
              <div className="user-profile-body-label">
                <p className="dark:text-white">Email</p>
              </div>
              <div className="user-profile-body-input-container">
                <input className="user-profile-body-input" />
              </div>
            </div>
            <div className="user-profile-body">
              <div className="user-profile-body-label">
                <p className="dark:text-white">Password</p>
              </div>
              <div className="user-profile-body-input-container">
                <input className="user-profile-body-input" />
              </div>
            </div>
            <div className="user-profile-body">
              <div className="user-profile-body-label">
                <p className="dark:text-white">Full name</p>
              </div>
              <div className="user-profile-body-input-container">
                <input className="user-profile-body-input" />
              </div>
            </div>
          </div>
        </Card>
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
            <div className="sticky top-0 z-10 flex items-center justify-between bg-white p-4 dark:bg-gray-800">
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
      </div>
    </WidgetWrapper>
  );
};

export default UserProfile;
