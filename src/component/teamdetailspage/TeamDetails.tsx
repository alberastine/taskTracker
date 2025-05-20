import { Team } from "../../models/Team";
import { useEffect, useState, useContext, useCallback } from "react";
import { getUserTeams } from "../../context/teamContext";
import { UserContext } from "../../context/userContext";
import { Card, Descriptions, Typography, Row, Col, Button } from "antd";
import WidgetWrapper from "../WidgetWrapper";
import DeleteTeam from "../../component/teampage/DeleteTeam";
import LeaveTeam from "../../component/teampage/LeaveTeam";
import TeamInviteUser from "./TeamInviteUser";
import TeamJoinRequest from "./TeamJoinRequest";
import TeamMembers from "./TeamMembers";
import TeamTaskList from "./TeamTaskList";

const { Title } = Typography;
type ComponentKey = "one" | "two" | "three" | "four" | null;

const TeamDetailsPage = ({
  teamId,
  setActiveWidget,
}: {
  teamId: string | null;
  setActiveWidget: (key: number) => void;
}) => {
  const [team, setTeam] = useState<Team | null>(null);
  const { user: currentUser } = useContext(UserContext);
  const [activeComponent, setActiveComponent] = useState<ComponentKey>("one");

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

  const renderComponent = () => {
    switch (activeComponent) {
      case "one":
        return <TeamMembers team={team} onTeamUpdated={fetchTeamDetails} />;
      case "two":
        return <TeamTaskList team={team} onTeamUpdated={fetchTeamDetails}/>;
      case "three":
        return <TeamInviteUser team={team} />;
      case "four":
        return <TeamJoinRequest team={team} />;
      default:
        return null;
    }
  };

  return (
    <WidgetWrapper>
      <Card
        title={
          <Row justify="space-between" align="middle">
            <Col>
              <div style={{ display: "flex", gap: "5rem" }}>
                <Title level={3} style={{ marginBottom: 0 }}>
                  {team.team_name}
                </Title>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <Button
                    onClick={() => setActiveComponent("one")}
                    style={{
                      backgroundColor: "rgb(14 116 144)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    Members
                  </Button>
                  <Button
                    onClick={() => setActiveComponent("two")}
                    style={{
                      backgroundColor: "rgb(14 116 144)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    Task list
                  </Button>
                  <Button
                    onClick={() => setActiveComponent("three")}
                    style={{
                      backgroundColor: "rgb(14 116 144)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    Invited user
                  </Button>
                  <Button
                    onClick={() => setActiveComponent("four")}
                    style={{
                      backgroundColor: "rgb(14 116 144)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    Join request
                  </Button>
                </div>
              </div>
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
          <Descriptions.Item label="Leader">
            {team.leader_username}
          </Descriptions.Item>
          <Descriptions.Item label="Member Limit">
            {team.member_limit}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: "20px" }}>{renderComponent()}</div>
      </Card>
    </WidgetWrapper>
  );
};

export default TeamDetailsPage;
