import { Team, TeamTask } from "../../models/Team";
import { Button, Form, Input, Modal, Select, Typography } from "antd";

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
  const [form] = Form.useForm();

  const assignedMember = team.members_lists.find(
    (member) => member.user_id === task?.assigned_to,
  );

  const handleEditTask = async () => {
    onTeamUpdated?.();
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
              >
                Save
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
            dateStarted: task?.date_published,
            deadline: task?.deadline,
            status: task?.status,
            assigned_to: assignedMember?.username,
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
          <Form.Item name="dateStarted" label="Date Started">
            <Input
              style={{
                width: "100%",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                height: "40px",
              }}
            />
          </Form.Item>
          <Form.Item name="deadline" label="Deadline">
            <Input
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
