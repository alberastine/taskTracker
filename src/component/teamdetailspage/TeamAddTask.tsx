import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Typography,
  DatePicker,
} from "antd";
import { useState } from "react";
import { Team } from "../../models/Team";
import { addTeamTask } from "../../context/teamContext";
import { LoadingOutlined } from "@ant-design/icons";

const TeamAddTask = ({
  team,
  onTeamUpdated,
}: {
  team: Team;
  onTeamUpdated: () => void;
}) => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const [form] = Form.useForm();

  const handleAddTask = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        ...values,
        date_published: new Date().toISOString().split("T")[0],
        deadline: values.deadline.format("YYYY-MM-DD"),
      };

      setLoading(true);
      setShowSpinner(true);

      const delay = new Promise((resolve) => setTimeout(resolve, 1500));
      await delay;

      await addTeamTask(team._id, payload);
      message.success("Task added successfully");
      form.resetFields();
      setIsAddTaskModalOpen(false);
      onTeamUpdated?.();
    } catch (error) {
      console.log("Validation failed or API error:", error);
      message.error("Please fill out all required fields correctly");
    } finally {
      setLoading(false);
      setShowSpinner(false);
    }
  };

  const handleCancel = () => {
    setIsAddTaskModalOpen(false);
    form.resetFields();
  };

  return (
    <div>
      <Button
        className="team-options w-full"
        style={{
          backgroundColor: "rgb(14 116 144)",
          color: "white",
          border: "none",
        }}
        onClick={() => setIsAddTaskModalOpen(true)}
      >
        + Add Task
      </Button>

      <Modal
        open={isAddTaskModalOpen}
        onCancel={handleCancel}
        footer={
          <div className="flex justify-end">
            <Button
              type="primary"
              style={{
                backgroundColor: "rgb(14 116 144)",
                border: "none",
              }}
              onClick={handleAddTask}
              disabled={loading}
            >
              Add Task {showSpinner && <LoadingOutlined />}
            </Button>
          </div>
        }
      >
        <Typography.Title level={4}>Add Task</Typography.Title>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            task_name: "",
            assigned_to: "",
            description: "",
            deadline: null,
            status: "No Started",
          }}
        >
          <Form.Item
            name="task_name"
            label="Task Name"
            rules={[{ required: true, message: "Task name is required" }]}
          >
            <Input
              style={{
                width: "100%",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                height: "40px",
              }}
            />
          </Form.Item>

          <Form.Item name="assigned_to" label="Assigned To">
            <Select
              options={team.members_lists.map((member) => ({
                label: member.username,
                value: member.user_id,
              }))}
              style={{
                height: "40px",
              }}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea
              rows={3}
              allowClear
              style={{
                height: "40px",
              }}
            />
          </Form.Item>

          <Form.Item
            name="deadline"
            label="Deadline"
            rules={[{ required: true, message: "Deadline is required" }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Input
              style={{
                width: "100%",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                height: "40px",
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamAddTask;
