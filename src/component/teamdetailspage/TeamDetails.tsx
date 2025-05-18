import { Team } from "../../models/Team";
import { TeamTask } from "../../models/Team";
import { useEffect, useState, useContext, useCallback } from "react";
import { getUserTeams } from "../../context/teamContext";
import {
  Card,
  Descriptions,
  Typography,
  Divider,
  List,
  Empty,
  Row,
  Col,
  Button,
  Tag,
  Table,
} from "antd";
import WidgetWrapper from "../WidgetWrapper";
import DeleteTeam from "../../component/teampage/DeleteTeam";
import LeaveTeam from "../../component/teampage/LeaveTeam";
import { UserContext } from "../../context/userContext"; // Assuming you're using context for currentUser

const { Title, Text } = Typography;

const TeamDetailsPage = ({
  teamId,
  setActiveWidget,
}: {
  teamId: string | null;
  setActiveWidget: (key: number) => void;
}) => {
  const [team, setTeam] = useState<Team | null>(null);
  const { user: currentUser } = useContext(UserContext);

  const fetchTeamDetails = useCallback(async () => {
    try {
      const allTeams = await getUserTeams();
      const selectedTeam = allTeams.find((team: Team) => team._id === teamId);
      setTeam(selectedTeam || null);
    } catch (error) {
      console.error("Error fetching team details:", error);
    }
  }, [teamId]);

  useEffect(() => {
    if (teamId) {
      fetchTeamDetails();
    }
  }, [teamId, fetchTeamDetails]);

  if (!team) {
    return <Card style={{ margin: "2rem" }}>Loading or team not found...</Card>;
  }
  const createdAt = new Date(team.createdAt);

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
    <WidgetWrapper>
      <Card
        title={
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} style={{ marginBottom: 0 }}>
                {team.team_name}
              </Title>
            </Col>

            <Col>
              {team.leader_id === currentUser?._id ? (
                <DeleteTeam
                  selectedTeamId={team._id}
                  onTeamDeleted={fetchTeamDetails}
                  setActiveWidget={setActiveWidget}
                />
              ) : (
                <LeaveTeam
                  selectedTeamId={team._id}
                  onTeamLeaved={fetchTeamDetails}
                />
              )}
            </Col>
          </Row>
        }
        style={{
          border: "none",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Created At">
            {createdAt.toLocaleDateString()} at {createdAt.toLocaleTimeString()}
          </Descriptions.Item>
          <Descriptions.Item label="Leader Username">
            {team.leader_username}
          </Descriptions.Item>
          <Descriptions.Item label="Member Limit">
            {team.member_limit}
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Members</Divider>
        {team.members_lists.length > 0 ? (
          <List
            bordered
            dataSource={team.members_lists}
            renderItem={(member) => (
              <List.Item>
                <Text>{member.username}</Text>
                <Text type="secondary"> (ID: {member.user_id})</Text>
              </List.Item>
            )}
          />
        ) : (
          <Empty description="No members" />
        )}

        <Divider orientation="left">Tasks</Divider>
        {team.tasks.length > 0 ? (
          <Table
            columns={taskColumns}
            dataSource={taskData}
            pagination={false}
          />
        ) : (
          <Empty description="No tasks" />
        )}

        <Divider orientation="left">Invited Users</Divider>
        {team.invited_users.length > 0 ? (
          <List
            bordered
            dataSource={team.invited_users}
            style={{ height: "56px", alignContent: "center" }}
            renderItem={(user) => (
              <List.Item
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div
                  style={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>{user.username}</Text>
                  <Text type="secondary"> ID: {user.user_id}</Text>
                </div>

                <div>
                  <Text type="secondary">
                    invited at: {new Date(user.invited_at).toLocaleDateString()}
                  </Text>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty description="No invited users" />
        )}

        <Divider orientation="left">Join Requests</Divider>
        {team.join_requests.length > 0 ? (
          <List
            bordered
            dataSource={team.join_requests}
            renderItem={(user) => (
              <List.Item
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div
                  style={{
                    width: "50%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>{user.username}</Text>
                  <Text type="secondary"> ID: {user.user_id}</Text>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "1rem",
                  }}
                >
                  <Button
                    style={{
                      backgroundColor: "rgb(14 116 144)",
                      color: "white",
                      border: "none",
                    }}
                    // onClick={() =>
                    //   selectedTeam &&
                    //   handleTeamRequest("accept", selectedTeam, user._id)
                    // }
                  >
                    Accept
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "rgb(220, 20, 60)",
                      color: "white",
                      border: "none",
                    }}
                    // onClick={() =>
                    //   selectedTeam &&
                    //   handleTeamRequest("reject", selectedTeam, user._id)
                    // }
                  >
                    Reject
                  </Button>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty description="No join requests" />
        )}
      </Card>
    </WidgetWrapper>
  );
};

export default TeamDetailsPage;
