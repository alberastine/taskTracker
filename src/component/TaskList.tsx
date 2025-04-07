import { Badge, Checkbox, Table } from "flowbite-react";
import TaskData from "../component/UserData.json";
import AddTask from "./AddTask";
import TaskListEditDetails from "./TaskListEditDetails";
interface TaskData {
  id: number;
  taskName: string;
  dateStarted: string;
  deadline: string;
  status: string;
}

const TaskList = () => {
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
            {TaskData.map((task) => (
              <Table.Row
                key={task.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="p-4">
                  <Checkbox checked={task.status === "completed"} />
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {task.taskName}
                </Table.Cell>
                <Table.Cell>{task.dateStarted}</Table.Cell>
                <Table.Cell>{task.deadline}</Table.Cell>
                <Table.Cell>
                  <p className="text-sm">
                    <Badge
                      color={
                        task.status === "completed"
                          ? "success"
                          : task.status === "late"
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
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

export default TaskList;
