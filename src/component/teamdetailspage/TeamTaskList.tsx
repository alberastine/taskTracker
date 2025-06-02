import { Button, Divider, Empty, message, Table, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { Team, TeamTask } from "@/models/Team";
import { useContext, useMemo, useState } from "react";
import { UserContext } from "@/context/userContext";
// import TeamAssignUserTask from "./TeamAssignUserTask";
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
  const isLeader = team.leader_id === currentUser?._id;

  const canEditTask = (task: TeamTask): boolean => {
    return isLeader || task.assigned_to === currentUser?._id;
  };

  const getEditMessage = (task: TeamTask): string | null => {
    if (!task.assigned_to)
      return "This task is unassigned. Please claim it to make edits.";
    if (task.assigned_to !== currentUser?._id)
      return "You are not assigned to this task and do not have permission to edit it.";
    return null;
  };

  const renderAssignedTo = (assignedTo: string) => {
    const assignedMember = team.members_lists.find(
      (member) => member.user_id === assignedTo,
    );

    if (assignedTo) {
      return <Text>{assignedMember?.username}</Text>;
    }

    return assignedMember && isLeader === undefined ? (
      <Tag color="red">Not assigned</Tag>
    ) : (
      <Button
        style={{
          backgroundColor: "rgb(14 116 144)",
          color: "white",
          border: "none",
        }}
      >
        Claim task
      </Button>
    );
  };

  const taskColumns: ColumnsType<TeamTask> = [
    {
      title: "Task Name",
      dataIndex: "task_name",
      key: "task_name",
      render: (text: string) => <Text strong>{text}</Text>,
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
      render: renderAssignedTo,
    },
  ];

  const taskData = useMemo(
    () =>
      team.tasks.map((task) => ({
        ...task,
        key: task._id,
      })),
    [team.tasks],
  );

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
          {isLeader && (
            <TeamAddTask team={team} onTeamUpdated={onTeamUpdated} />
          )}
        </div>
      </Divider>

      {team.tasks.length > 0 ? (
        <Table
          columns={taskColumns}
          dataSource={taskData}
          pagination={false}
          rowKey={(record) => record._id}
          scroll={{ y: 270 }}
          rowClassName={(record) =>
            record._id === selectedTaskId ? "selected-row" : ""
          }
          onRow={(record) => ({
            style: { cursor: "pointer" },
            onClick: () => {
              if (canEditTask(record)) {
                setSelectedTaskId(record._id);
                setSelectedTask(record);
                setIsEditModalVisible(true);
              } else {
                const messageText = getEditMessage(record);
                if (messageText) message.warning(messageText);
              }
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

      {isEditModalVisible && selectedTask && (
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
