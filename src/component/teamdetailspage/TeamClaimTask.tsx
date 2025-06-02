import { LoadingOutlined } from "@ant-design/icons";
import { claimTeamTask } from "@/context/teamContext";
import { Team } from "@/models/Team";
import { Button, Modal, Typography, message } from "antd";
import { useState } from "react";

const TeamClaimTask = ({
  team,
  taskId,
  currentUser,
  onTeamUpdated,
}: {
  team: Team;
  taskId: string;
  currentUser: string | undefined;
  onTeamUpdated: () => void;
}) => {
  const [isAssignUserTaskModalOpen, setIsAssignUserTaskModalOpen] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const handleAssignUserTask = async () => {
    try {
      setLoading(true);
      setShowSpinner(true);

      const delay = new Promise((resolve) => setTimeout(resolve, 1500));
      await delay;

      await claimTeamTask(team._id, taskId, currentUser || "");
      setIsAssignUserTaskModalOpen(false);
      onTeamUpdated?.();
      message.success("Task claimed successfully");
    } catch (error) {
      console.error("Error claiming task:", error);
      message.error("Failed to claim task. Please try again.");
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
        onClick={(e) => {
          setIsAssignUserTaskModalOpen(true);
          e.stopPropagation();
        }}
      >
        Claim Task
      </Button>
      <Modal
        open={isAssignUserTaskModalOpen}
        onCancel={(e) => {
          e?.stopPropagation?.();
          handleCancel();
        }}
        footer={
          <>
            <Button
              style={{
                backgroundColor: "rgb(220, 20, 60)",
                color: "white",
                border: "none",
              }}
              onClick={(e) => {
                e?.stopPropagation?.();
                handleCancel();
              }}
            >
              Cancel
            </Button>
            <Button
              style={{
                backgroundColor: "rgb(14 116 144)",
                color: "white",
                border: "none",
              }}
              onClick={handleAssignUserTask}
              disabled={loading}
            >
              Claim {showSpinner && <LoadingOutlined />}
            </Button>
          </>
        }
      >
        <Typography.Title level={4}>Claim Task</Typography.Title>
        <Typography.Text>
          Are you sure you want to claim this task?
        </Typography.Text>
      </Modal>
    </div>
  );
};

export default TeamClaimTask;
