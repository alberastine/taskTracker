import { LoadingOutlined } from "@ant-design/icons";
import { deleteTeam } from "../../context/teamContext";
import { Button, Typography, Modal, message } from "antd";
import { useState } from "react";

const DeleteTeam = ({
  selectedTeamId,
  onTeamDeleted,
}: {
  selectedTeamId: string;
  onTeamDeleted: () => void;
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const handleDeleteTeam = async () => {
    if (!selectedTeam) return;

    try {
      setLoading(true);
      setShowSpinner(true);
      const delay = new Promise((resolve) => setTimeout(resolve, 1000));

      await delay;

      await deleteTeam(selectedTeam);
      onTeamDeleted();
      setIsDeleteModalOpen(false);
      message.success("Team deleted successfully");
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
        type="primary"
        danger
        onClick={() => {
          setSelectedTeam(selectedTeamId);
          setIsDeleteModalOpen(true);
        }}
      >
        Delete Team
      </Button>
      <Modal
        title={
          <Typography.Text strong>
            Are you sure you want to delete this team?
          </Typography.Text>
        }
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsDeleteModalOpen(false)}
            style={{ backgroundColor: "rgb(220, 20, 60)", color: "white" }}
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            onClick={handleDeleteTeam}
            style={{
              backgroundColor: "rgb(14 116 144)",
              color: "white",
            }}
            disabled={loading}
          >
            Delete {showSpinner && <LoadingOutlined />}
          </Button>,
        ]}
      >
        <Typography.Text>
          This action cannot be undone. All data associated with this team will
          be permanently deleted.
        </Typography.Text>
        <br />
        <br />
        <Typography.Text type="danger">
          Please confirm that you want to delete this team.
        </Typography.Text>
      </Modal>
    </div>
  );
};

export default DeleteTeam;
