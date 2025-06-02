import { Button, Divider, Empty, List, message, Typography } from "antd";

import { Team } from "@/models/Team";
import { respondToJoinRequest } from "@/context/teamContext";
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

const { Text } = Typography;
type ComponentKey = "one" | "two" | "three" | "four" | null;

const TeamJoinRequest = ({
  team,
  onTeamUpdated,
  setActiveComponent,
}: {
  team: Team;
  onTeamUpdated: () => void;
  setActiveComponent: (key: ComponentKey) => void;
}) => {
  const [loadingAction, setLoadingAction] = useState<{
    teamId: string;
    userId: string;
    action: "accept" | "decline";
  } | null>(null);

  const handleResponse = async (
    teamId: string,
    userId: string,
    accept: boolean,
  ) => {
    setLoadingAction({ teamId, userId, action: accept ? "accept" : "decline" });

    const delay = new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      await delay;
      await respondToJoinRequest(teamId, userId, accept);
      if (accept) {
        message.success("Join request response sent successfully");
        await delay;
        setActiveComponent("one");
      } else {
        message.success("Join request declined successfully");
      }
      onTeamUpdated?.();
    } catch (error) {
      console.error("Error responding to join request", error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div>
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
                  disabled={!!loadingAction}
                  style={{
                    backgroundColor: "rgb(14 116 144)",
                    color: "white",
                    border: "none",
                  }}
                  onClick={() => handleResponse(team._id, user.user_id, true)}
                >
                  Accept
                  {loadingAction?.teamId === team._id &&
                    loadingAction.userId === user.user_id &&
                    loadingAction.action === "accept" && <LoadingOutlined />}
                </Button>
                <Button
                  disabled={!!loadingAction}
                  style={{
                    backgroundColor: "rgb(220, 20, 60)",
                    color: "white",
                    border: "none",
                  }}
                  onClick={() => handleResponse(team._id, user.user_id, false)}
                >
                  Decline
                  {loadingAction?.teamId === team._id &&
                    loadingAction.userId === user.user_id &&
                    loadingAction.action === "decline" && <LoadingOutlined />}
                </Button>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="No join requests" />
      )}
    </div>
  );
};

export default TeamJoinRequest;
