import { useState } from "react";
import { Button, Modal, Input, Form, message } from "antd";
import { createTeam } from "@/context/teamContext";
import { LoadingOutlined } from "@ant-design/icons";

const CreateTeam = ({ onTeamCreated }: { onTeamCreated: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      message.warning("Team name cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      setShowSpinner(true);

      const delay = new Promise((resolve) => setTimeout(resolve, 1500));
      await delay;

      const res = await createTeam(teamName);

      message.success(res.message || "Team created successfully!");

      onTeamCreated();

      setTeamName("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating team:", error);
      message.error("Failed to create team. Please try again.");
    } finally {
      setLoading(false);
      setShowSpinner(false);
    }
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
        onClick={() => setIsModalOpen(true)}
      >
        + Create Team
      </Button>

      <Modal
        title="Create Team"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        okText="Create"
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsModalOpen(false)}
            style={{
              backgroundColor: "rgb(220, 20, 60)",
              color: "white",
            }}
          >
            Cancel
          </Button>,
          <Button
            key="create"
            type="primary"
            onClick={handleCreateTeam}
            style={{ backgroundColor: "rgb(14 116 144)", color: "white" }}
            disabled={loading}
          >
            Create {showSpinner && <LoadingOutlined />}
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Team Name" required>
            <Input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              style={{
                width: "100%",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateTeam;
