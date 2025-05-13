import { Badge, Checkbox, Table } from "flowbite-react";
import { DeleteOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { Task } from "../../models/User";
import { taskApi } from "../../api/taskApi";
import { Button, message, Modal } from "antd";

import AddTask from "./AddTask";
import TaskListEditDetails from "../taskpage/TaskListEditDetails";
import axios from "../../api/axios";

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/getTasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, [tasks]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleDeleteTask = async () => {
    if (!selectedTaskId) return;
    try {
      await taskApi.deleteTask(selectedTaskId);
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== selectedTaskId),
      );
      user.tasks = user.tasks.filter((task) => task._id !== selectedTaskId);
      message.success("Task deleted successfully");
      setShowModal(false);
      setSelectedTaskId(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      message.error("Failed to delete task");
    }
  };

  const isModalOpen = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowModal(true);
  };
  const handleCancel = () => {
    setShowModal(false);
  };

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
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <Table.Row
                  key={task._id || index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="p-4">
                    <Checkbox checked={task.status === "Completed"} readOnly />
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {task.taskName}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(task.dateStarted).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(task.deadline).toLocaleDateString()}
                  </Table.Cell>
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
                  <Table.Cell className="flex items-center gap-6">
                    <TaskListEditDetails task={task} />
                    <DeleteOutlined
                      onClick={() => {
                        isModalOpen(task._id);
                      }}
                      style={{ fontSize: "20px", cursor: "pointer" }}
                    />
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
      <Modal
        title="Are you sure you want to delete this task?"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={[
          <div className="displayflex-flexend">
            <Button
              key="cancel"
              className="button-no-focus"
              onClick={handleCancel}
              style={{ backgroundColor: "rgb(220, 20, 60)", color: "white" }}
            >
              Cancel
            </Button>
            <Button
              key="submit"
              className="button-no-focus"
              onClick={handleDeleteTask}
              style={{
                backgroundColor: "rgb(14 116 144)",
                color: "white",
              }}
            >
              Yes
            </Button>
          </div>,
        ]}
      >
        <p>This action cannot be undone. Do you want to proceed?</p>
      </Modal>
    </>
  );
};

export default TaskList;
