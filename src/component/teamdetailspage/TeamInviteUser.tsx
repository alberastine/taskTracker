import { Divider, Empty, List, Typography } from "antd";

import { Team } from "../../models/Team";

const { Text } = Typography;

const TeamInviteUser = ({ team }: { team: Team }) => {
  return (
    <div>
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
                  Invited at: {new Date(user.invited_at).toLocaleDateString()}
                </Text>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="No invited users" />
      )}
    </div>
  );
};

export default TeamInviteUser;
