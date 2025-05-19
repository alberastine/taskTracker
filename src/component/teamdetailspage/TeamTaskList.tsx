import { Button, Divider, Empty, Table, Tag, Typography } from "antd";

import { Team } from "../../models/Team";
import { TeamTask } from "../../models/Team";

const { Text } = Typography;

const TeamTaskList = ({ team }: { team: Team }) => {
  const taskColumns = [
    {
      title: "Task Name",
      dataIndex: "task_name",
      key: "task_name",
      render: (text: string, record: TeamTask) => (
        <>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary">{record.description || "No description"}</Text>
        </>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : "None",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color="blue">{status || "Not started"}</Tag>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: "assigned_to",
      key: "assigned_to",
      render: (assignedTo: string) =>
        assignedTo ? (
          <Text>{assignedTo}</Text>
        ) : (
          <Button
            style={{
              backgroundColor: "rgb(14 116 144)",
              color: "white",
              border: "none",
            }}
          >
            Assign To
          </Button>
        ),
    },
  ];

  const taskData = team.tasks.map((task, index) => ({
    key: index,
    ...task,
  }));

  return (
    <div>
      <Divider orientation="left">Tasks</Divider>
      {team.tasks.length > 0 ? (
        <Table columns={taskColumns} dataSource={taskData} pagination={false} />
      ) : (
        <Empty description="No tasks" />
      )}
    </div>
  );
};

export default TeamTaskList;
