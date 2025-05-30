import { Button, Divider, Empty, Table, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table";

import { Team } from "../../models/Team";
import { TeamTask } from "../../models/Team";

import { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import TeamAssignUserTask from "./TeamAssignUserTask";
import TeamAddTask from "./TeamAddTask";
import TeamEditTask from "./TeamEditTask";

const { Text } = Typography;

const TeamTaskList = ({
  team,
  onTeamUpdated,
}: {
  team: Team;
  onTeamUpdated: () => void;
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<TeamTask | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const { user: currentUser } = useContext(UserContext);

  const handleAssignClick = (task: TeamTask) => {
    console.log("Assign clicked for task", task._id);
  };

  const taskColumns: ColumnsType<TeamTask> = [
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
              <TeamAssignUserTask
                team={team}
                taskId={record._id}
                onTeamUpdated={onTeamUpdated}
              />
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
          dataSource={team.tasks.map((task) => ({
            ...task,
            key: task._id,
          }))}
          pagination={false}
          rowKey={(record) => record._id}
          scroll={{ y: 270 }}
          rowClassName={(record) =>
            record._id === selectedTaskId ? "selected-row" : ""
          }
          onRow={(record) => ({
            style: { cursor: "pointer" },
            onClick: () => {
              setSelectedTaskId(record._id);
              setSelectedTask(record);
              setIsEditModalVisible(true);
            },
          })}
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
      {selectedTask && (
        <TeamEditTask
          visible={isEditModalVisible}
          task={selectedTask}
          team={team}
          onTeamUpdated={onTeamUpdated}
          onClose={() => {
            setIsEditModalVisible(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

export default TeamTaskList;
