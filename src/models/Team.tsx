export interface InvitedUser {
  user_id: string;
  username: string;
  invited_at: string;
}

export interface JoinReuest {
  user_id: string;
  username: string;
  requested_at: string;
}

export interface MembersList {
  user_id: string;
  username: string;
}

export interface TeamTask {
  _id: string;
  task_name: string;
  assigned_to: string;
  description: string;
  date_published: string;
  deadline: string;
  status: string;
}

export interface Team {
  _id: string;
  team_name: string;
  leader_username: string;
  leader_id: string;
  member_limit: number;
  invited_users: InvitedUser[];
  join_requests: JoinReuest[];
  members_lists: MembersList[];
  tasks: TeamTask[];
  createdAt: Date;
}
