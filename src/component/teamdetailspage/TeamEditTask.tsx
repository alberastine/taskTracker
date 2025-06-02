import { useState } from "react";
import { deleteTeamTask, updateTeamTask } from "@/context/teamContext";
import { Team, TeamTask } from "@/models/Team";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Typography,
} from "antd";

import dayjs from "dayjs";
import { LoadingOutlined } from "@ant-design/icons";

const TeamEditTask = ({
  visible,
  task,
  team,
  onTeamUpdated,
  onClose,
}: {
  visible: boolean;
  task: TeamTask | null;
  team: Team;
  onTeamUpdated: () => void;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form] = Form.useForm();

  const assignedMember = team.members_lists.find(
    (member) => member.user_id === task?.assigned_to,
  );

  const handleEditTask = async () => {
    try {
      const values = await form.validateFields();

      setLoading(true);
      setShowSpinner(true);

      const delay = new Promise((resolve) => setTimeout(resolve, 1500));
      await delay;

      await updateTeamTask(team._id, task?._id || "", {
        task_name: values.task_name,
        description: values.description,
        deadline: values.deadline?.toISOString(),
        status: values.status,
        assigned_to: values.assigned_to,
      });

      message.success("Task updated successfully!");
      onTeamUpdated?.();
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      message.error("Failed to update task");
    } finally {
      setLoading(false);
      setShowSpinner(false);
    }
  };

  const handleDeleteTask = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this task?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okButtonProps: {
        disabled: deleting,
        danger: true,
      },
      async onOk() {
        try {
          setDeleting(true);

          const delay = new Promise((resolve) => setTimeout(resolve, 1500));
          await delay;

          await deleteTeamTask(team._id, task?._id || "");
          message.success("Task deleted successfully.");

          onTeamUpdated?.();
          onClose();
        } catch (error) {
          console.error("Delete error:", error);
          message.error("Failed to delete task.");
          throw error;
        } finally {
          setDeleting(false);
        }
      },
      onCancel() {
        setDeleting(false);
      },
    });
  };

  return (
    <div>
      <Modal
        open={visible}
        onCancel={onClose}
        footer={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Button
                type="primary"
                style={{
                  backgroundColor: "rgb(220, 20, 60)",
                  border: "none",
                }}
                onClick={handleDeleteTask}
              >
                Delete Task
              </Button>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Button
                type="primary"
                style={{
                  backgroundColor: "rgb(220, 20, 60)",
                  border: "none",
                }}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                style={{
                  backgroundColor: "rgb(14 116 144)",
                  border: "none",
                }}
                onClick={handleEditTask}
                disabled={loading}
              >
                Save {showSpinner && <LoadingOutlined />}
              </Button>
            </div>
          </div>
        }
      >
        <Typography.Title level={4}>Edit Team Task</Typography.Title>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            task_name: task?.task_name,
            description: task?.description,
            deadline: dayjs(task?.deadline),
            status: task?.status,
            assigned_to: assignedMember?.user_id,
          }}
        >
          <Form.Item name="task_name" label="Task Name">
            <Input
              style={{
                width: "100%",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                height: "40px",
              }}
            />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea
              style={{
                width: "100%",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                height: "40px",
              }}
            />
          </Form.Item>

          <Form.Item name="deadline" label="Deadline">
            <DatePicker
              style={{
                width: "100%",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                height: "40px",
              }}
            />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select
              style={{
                height: "40px",
              }}
              options={[
                { label: "Not Started", value: "Not Started" },
                { label: "In Progress", value: "In Progress" },
                { label: "Completed", value: "Completed" },
              ]}
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
        </Form>
      </Modal>
    </div>
  );
};

export default TeamEditTask;
