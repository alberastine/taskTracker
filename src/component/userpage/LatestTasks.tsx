import { Card } from "flowbite-react";
import { useCallback, useContext, useEffect } from "react";
import { UserContext } from "@/context/userContext";
import axios from "@/api/axios";

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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-[#f6ffed] border border-[#b7eb8f] text-[#389e0d]";
      case "Ongoing":
        return "bg-[#e6f4ff] border border-[#91caff] text-[#0958d9]";
      case "Late":
        return "bg-[#fff1f0] border border-[#ffa39e] text-[#cf1322]";
      default:
        return "bg-gray-50 border text-gray-700";
    }
  };

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
            className={`rounded-md p-2 shadow-sm ${getStatusStyle(
              task.status,
            )}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{task.taskName}</p>
                <p className="text-sm">
                  {new Date(task.dateStarted).toLocaleDateString()} to{" "}
                  {new Date(task.deadline).toLocaleDateString()}
                </p>
              </div>
              <span className="text-sm font-semibold">{task.status}</span>
            </div>
          </div>
        ))}
    </Card>
  );
};

export default LatestTasks;
