import { Badge, Checkbox, Table } from "flowbite-react";
import AddTask from "./AddTask";
import TaskListEditDetails from "./TaskListEditDetails";

import { useContext } from "react";
import { UserContext } from "../context/userContext";

const TaskList = () => {
  const { user } = useContext(UserContext);
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="overflow-x-auto p-4">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell className="p-4"></Table.HeadCell>
            <Table.HeadCell>Task name</Table.HeadCell>
            <Table.HeadCell>Date started</Table.HeadCell>
            <Table.HeadCell>Deadline</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>
              <AddTask />
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
  {user.tasks.length > 0 ? (
    user.tasks.map((task, index) => (
      <Table.Row
        key={task.id || index}
        className="bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        <Table.Cell className="p-4">
          <Checkbox checked={task.status === "Completed"} readOnly />
        </Table.Cell>
        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
          {task.taskName}
        </Table.Cell>
        <Table.Cell>{new Date(task.dateStarted).toLocaleDateString()}</Table.Cell>
        <Table.Cell>{new Date(task.deadline).toLocaleDateString()}</Table.Cell>
        <Table.Cell>
          <p className="text-sm">
            <Badge
              color={
                task.status === "Completed"
                  ? "success"
                  : task.status === "Late"
                    ? "failure"
                    : "gray"
              }
              className={`px-2 py-1 ${task.status.length > 10 ? "text-lg" : "text-sm"} `}
            >
              {task.status}
            </Badge>
          </p>
        </Table.Cell>
        <Table.Cell>
          <TaskListEditDetails task={task} />
        </Table.Cell>
      </Table.Row>
    ))
  ) : (
    <Table.Row>
      <Table.Cell colSpan={6} className="text-center">
        You have not added any tasks
      </Table.Cell>
    </Table.Row>
  )}
</Table.Body>
        </Table>
      </div>
    </>
  );
};

export default TaskList;
