import { Card } from "flowbite-react";
import { useCallback, useContext, useEffect } from "react";
import { UserContext } from "../../context/userContext";

import axios from "../../api/axios";

const LatestTasks = ({
  setActiveWidget,
}: {
  setActiveWidget: (key: number) => void;
}) => {
  const { user, setUser } = useContext(UserContext);

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get("/profile");
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    }
  }, [setUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (!user) {
    return <div>User not found</div>;
  }
  return (
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
            key={task._id || index}
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
  );
};

export default LatestTasks;
