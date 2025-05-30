import { LoadingOutlined } from "@ant-design/icons";
import { updateAssignTo } from "../../context/teamContext";
import { Team } from "../../models/Team";
import { Button, Modal, Typography, Form, Select, message } from "antd";
import { useState } from "react";

const TeamAssignUserTask = ({
  team,
  taskId,
  onTeamUpdated,
}: {
  team: Team;
  taskId: string;
  onTeamUpdated: () => void;
}) => {
  const [isAssignUserTaskModalOpen, setIsAssignUserTaskModalOpen] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const [form] = Form.useForm();

  const handleAssignUserTask = async () => {
    try {
      setLoading(true);
      setShowSpinner(true);

      const delay = new Promise((resolve) => setTimeout(resolve, 1500));
      await delay;

      await updateAssignTo(team._id, taskId, form.getFieldValue("assigned_to"));
      setIsAssignUserTaskModalOpen(false);
      onTeamUpdated?.();
      message.success("Task assigned successfully");
    } catch (error) {
      console.error("Error assigning task:", error);
      message.error("Failed to assign task. Please try again.");
    } finally {
      setLoading(false);
      setShowSpinner(false);
    }
  };

  const handleCancel = () => {
    setIsAssignUserTaskModalOpen(false);
  };

  return (
    <div>
      <Button
        style={{
          backgroundColor: "rgb(14 116 144)",
          color: "white",
          border: "none",
        }}
        onClick={() => {
          setIsAssignUserTaskModalOpen(true);
        }}
      >
        Assign To
      </Button>
      <Modal
        open={isAssignUserTaskModalOpen}
        onCancel={handleCancel}
        footer={
          <Button
            style={{
              backgroundColor: "rgb(14 116 144)",
              color: "white",
              border: "none",
            }}
            onClick={handleAssignUserTask}
            disabled={loading}
          >
            Assign {showSpinner && <LoadingOutlined />}
          </Button>
        }
      >
        <Typography.Title level={4}>Assign User Task</Typography.Title>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            assigned_to: "",
          }}
        >
          <Form.Item name="assigned_to">
            <Select
              placeholder="Choose a team member"
              style={{ height: "40px" }}
            >
              {team.members_lists.map((member) => (
                <Select.Option key={member.user_id} value={member.user_id}>
                  {member.username}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamAssignUserTask;
