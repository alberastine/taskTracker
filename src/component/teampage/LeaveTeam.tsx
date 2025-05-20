import { LoadingOutlined } from "@ant-design/icons";
import { leaveTeam } from "../../context/teamContext";
import { Button, Typography, Modal, message } from "antd";
import { useState } from "react";

const LeaveTeam = ({
  selectedTeamId,
  onTeamLeaved,
}: {
  selectedTeamId: string;
  onTeamLeaved: () => void;
}) => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const handleLeaveTeam = async () => {
    if (!selectedTeam) return;

    try {
      setLoading(true);
      setShowSpinner(true);
      const delay = new Promise((resolve) => setTimeout(resolve, 1000));

      await delay;

      await leaveTeam(selectedTeam);
      onTeamLeaved();
      setIsLeaveModalOpen(false);
      message.success("Team left successfully");
    } catch (err) {
      console.error("Failed to delete team:", err);
    } finally {
      setLoading(false);
      setShowSpinner(false);
    }
  };

  return (
    <div>
      <Button
        style={{
          backgroundColor: "rgb(220, 20, 60)",
          color: "white",
          border: "none",
        }}
        onClick={() => {
          setSelectedTeam(selectedTeamId);
          setIsLeaveModalOpen(true);
        }}
      >
        Leave Team
      </Button>
      <Modal
        title={
          <Typography.Text strong>
            Are you sure you want to leave this team?
          </Typography.Text>
        }
        open={isLeaveModalOpen}
        onCancel={() => setIsLeaveModalOpen(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsLeaveModalOpen(false)}
            style={{ backgroundColor: "rgb(220, 20, 60)", color: "white" }}
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            onClick={handleLeaveTeam}
            style={{
              backgroundColor: "rgb(14 116 144)",
              color: "white",
            }}
            disabled={loading}
          >
            Leave {showSpinner && <LoadingOutlined />}
          </Button>,
        ]}
      >
        <Typography.Text>
          This action cannot be undone. Do you want to proceed?
        </Typography.Text>
        <br />
        <br />
        <Typography.Text type="danger">
          If you leave this team, you will no longer have access to its tasks
          and resources.
        </Typography.Text>
      </Modal>
    </div>
  );
};

export default LeaveTeam;
