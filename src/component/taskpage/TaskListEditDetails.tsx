import { Button, Modal, Form, Input, DatePicker, message, Select } from "antd";
import { useState } from "react";
import { Task } from "@/models/User";
import { taskApi } from "@/api/taskApi";

import dayjs from "dayjs";

import "@/styles/components/EditTask.css";
import { LoadingOutlined } from "@ant-design/icons";

interface TaskListEditDetailsProps {
  task: Task;
}

interface UpdatedTask {
  taskName: string;
  dateStarted: string;
  deadline: string;
  status: string;
}

const TaskListEditDetails = ({ task }: TaskListEditDetailsProps) => {
  const [form] = Form.useForm();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const handleEditClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setOpenModal(true);
  };

  const handleUpdateTask = async (value: UpdatedTask) => {
    if (!selectedTaskId) return;
    try {
      const updatedTask = {
        taskName: value.taskName,
        dateStarted: value.dateStarted,
        deadline: value.deadline,
        status: value.status,
      };
      setLoading(true);
      setShowSpinner(true);

      const delay = new Promise((resolve) => setTimeout(resolve, 1500));
      await delay;

      await taskApi.updateTask(selectedTaskId, updatedTask);
      setOpenModal(false);
      message.success("Updated task successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      message.error("Failed to delete task");
    } finally {
      setLoading(false);
      setShowSpinner(false);
    }
  };
  return (
    <div>
      <div>
        <a
          onClick={() => handleEditClick(task._id)}
          className="cursor-pointer font-medium text-cyan-600 hover:underline dark:text-cyan-500"
        >
          Edit
        </a>
      </div>

      <Modal
        title="Edit Task"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          autoComplete="off"
          onFinish={handleUpdateTask}
          initialValues={{
            taskName: task.taskName,
            dateStarted: dayjs(task.dateStarted),
            deadline: dayjs(task.deadline),
            status: task.status,
          }}
        >
          <Form.Item label="Task Name" name="taskName">
            <Input
              style={{
                width: "100%",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
              }}
            />
          </Form.Item>

          <Form.Item label="Date Started" name="dateStarted">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item label="Deadline" name="deadline">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select placeholder="Select status">
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Ongoing">Ongoing</Select.Option>
              <Select.Option value="Late">Late</Select.Option>
            </Select>
          </Form.Item>
          <>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setOpenModal(false)}
                style={{
                  backgroundColor: "rgb(220, 20, 60)",
                  color: "white",
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={loading}
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "rgb(14 116 144)",
                  color: "white",
                }}
              >
                Save {showSpinner && <LoadingOutlined />}
              </Button>
            </div>
          </>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskListEditDetails;
