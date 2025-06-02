import { Card } from "flowbite-react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useCallback, useContext, useEffect } from "react";
import { UserContext } from "@/context/userContext";

import axios from "@/api/axios";

type TaskStatus = "Completed" | "Ongoing" | "Late";

const ProgressChart = () => {
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
          colors={["#b7eb8f", "#91caff", "#ffa39e"]}
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
  );
};

export default ProgressChart;
