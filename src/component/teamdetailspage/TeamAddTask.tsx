import { Button, Input, message, Modal, Typography } from "antd";

import { useState } from "react";

import { Team } from "../../models/Team";
import { addTeamTask } from "../../context/teamContext";
import { Datepicker } from "flowbite-react";

const TeamAddTask = ({
  team,
  onTeamUpdated,
}: {
  team: Team;
  onTeamUpdated: () => void;
}) => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const [data, setData] = useState<{
    task_name: string;
    assigned_to: string;
    description: string;
    date_published: string;
    deadline: string;
    status: string;
  }>({
    task_name: "",
    assigned_to: "",
    date_published: "",
    description: "",
    deadline: "",
    status: "",
  });

  const handleAddTask = async (teamId: string) => {
    const {
      task_name,
      assigned_to,
      date_published,
      description,
      deadline,
      status,
    } = data;

    if (!task_name || !description || !deadline) {
      message.error("Please fill out the required fields");
      return;
    }
    const payload = {
      task_name,
      assigned_to,
      date_published,
      description,
      deadline,
      status,
    };
    try {
      await addTeamTask(teamId, payload);
      setIsAddTaskModalOpen(false);
      setData({
        task_name: "",
        assigned_to: "",
        date_published: "",
        description: "",
        deadline: "",
        status: "Not Started",
      });
      onTeamUpdated?.();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    setIsAddTaskModalOpen(false);
    setData({
      task_name: "",
      assigned_to: "",
      date_published: "",
      description: "",
      deadline: "",
      status: "",
    });
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
              className="team-options w-full"
              style={{
                backgroundColor: "rgb(14 116 144)",
                color: "white",
                border: "none",
              }}
              onClick={() => handleAddTask(team._id)}
            >
              Add Task
            </Button>
          </div>
        }
      >
        <Typography.Title level={4}>Add Task</Typography.Title>
        <Input
          placeholder="Task Name"
          value={data.task_name}
          onChange={(e) => setData({ ...data, task_name: e.target.value })}
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Assigned To"
          value={data.assigned_to}
          onChange={(e) =>
            setData((prev) => ({ ...prev, assigned_to: e.target.value }))
          }
          style={{ marginBottom: 8 }}
        />
        <Input.TextArea
          placeholder="Description"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          rows={3}
          style={{ marginBottom: 8 }}
        />
        <Datepicker
          placeholder="Start Date (YYYY-MM-DD)"
          value={data.date_published}
          onSelectedDateChanged={(date) =>
            setData({
              ...data,
              date_published: date.toLocaleDateString("en-CA"),
            })
          }
          style={{ marginBottom: 8 }}
        />
        <Datepicker
          placeholder="Deadline (YYYY-MM-DD)"
          value={data.deadline}
          onSelectedDateChanged={(date) =>
            setData({
              ...data,
              deadline: date.toLocaleDateString("en-CA"),
            })
          }
          style={{ marginBottom: 8 }}
        />
        <Input
          placeholder="Status"
          value={data.status}
          onChange={(e) => setData({ ...data, status: e.target.value })}
        />
      </Modal>
    </div>
  );
};

export default TeamAddTask;
