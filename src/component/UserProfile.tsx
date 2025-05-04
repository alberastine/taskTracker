import { RxAvatar } from "react-icons/rx";
import WidgetWrapper from "./WidgetWrapper";
import "../styles/components/UserProfile.css";
import { Card } from "flowbite-react";

import { useContext } from "react";
import { UserContext } from "../context/userContext";

const UserProfile = ({
  setActiveWidget,
}: {
  setActiveWidget: (key: number) => void;
}) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <WidgetWrapper>
      <div className="user-profile-container">
        <Card className="user-profile-left" style={{
              border: "none",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}>
          <div className="user-profile-header">
            <div className="user-profile-avatar">
              <RxAvatar size={200}/>
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
          <Card className="max-w-sm" style={{
              border: "none",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}>
            <div className="mb-4 flex items-center justify-between">
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
              <div key={task.id || index} className="flow-root">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  <li className="py-3 sm:py-4">
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {task.taskName}
                        </p>
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                          {new Date(task.dateStarted).toLocaleDateString()} to{" "}
                          {new Date(task.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        {task.status}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </WidgetWrapper>
  );
};

export default UserProfile;
