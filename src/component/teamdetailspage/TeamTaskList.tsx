import { Button, Divider, Empty, Table, Tag, Typography } from "antd";

import { Team } from "../../models/Team";
import { TeamTask } from "../../models/Team";
import TeamAddTask from "./TeamAddTask";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

const { Text } = Typography;

const TeamTaskList = ({
  team,
  onTeamUpdated,
}: {
  team: Team;
  onTeamUpdated: () => void;
}) => {
  const { user: currentUser } = useContext(UserContext);

  const handleAssignClick = (task: TeamTask) => {
    console.log("Assign clicked for task", task);
  };

  const taskColumns = [
    {
      title: "Task Name",
      dataIndex: "task_name",
      key: "task_name",
      render: (text: string) => (
        <>
          <Text strong>{text}</Text>
        </>
      ),
    },
    {
      title: "Date Published",
      dataIndex: "date_published",
      key: "date_published",
      render: (date: string) => new Date(date).toLocaleDateString(),
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
      render: (assignedTo: string, record: TeamTask) => {
        const assignedMember = team.members_lists.find(
          (member) => member.user_id === assignedTo,
        );
        if (assignedTo) {
          return <Text>{assignedMember?.username}</Text>;
        } else {
          if (team.leader_id === currentUser?._id) {
            return (
              <Button
                style={{
                  backgroundColor: "rgb(14 116 144)",
                  color: "white",
                  border: "none",
                }}
                onClick={() => handleAssignClick(record)}
              >
                Assign To
              </Button>
            );
          } else {
            return (
              <Button
                style={{
                  backgroundColor: "rgb(14 116 144)",
                  color: "white",
                  border: "none",
                }}
                onClick={() => handleAssignClick(record)}
              >
                Claim task
              </Button>
            );
          }
        }
      },
    },
  ];

  const taskData = team.tasks.map((task, index) => ({
    key: index,
    ...task,
  }));

  return (
    <div>
      <Divider orientation="left">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Text>Task</Text>
          {team.leader_id === currentUser?._id ? (
            <TeamAddTask team={team} onTeamUpdated={onTeamUpdated} />
          ) : null}
        </div>
      </Divider>
      {team.tasks.length > 0 ? (
        <Table
          columns={taskColumns}
          dataSource={taskData}
          pagination={false}
          scroll={{ y: 270 }}
          expandable={{
            expandedRowRender: (record: TeamTask) => (
              <p style={{ margin: 0, marginLeft: "3rem" }}>
                <strong>Description:</strong>{" "}
                {record.description || "No description"}
              </p>
            ),
            rowExpandable: (record: TeamTask) => !!record.description,
          }}
        />
      ) : (
        <Empty description="No tasks" />
      )}
    </div>
  );
};

export default TeamTaskList;
