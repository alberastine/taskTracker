import { Button, Divider, Empty, List, Typography } from "antd";

import { Team } from "../../models/Team";

const { Text } = Typography;

const TeamJoinRequest = ({ team }: { team: Team }) => {
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
    </div>
  );
};

export default TeamJoinRequest;
