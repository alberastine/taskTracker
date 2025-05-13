export interface Task {
  _id: string;
  taskName: string;
  dateStarted: string;
  deadline: string;
  status: string;
}

export interface CalendarEvent {
  _id: string;
  title: string;
  date: string;
}

export interface User {
  _id: string;
  username: string;
  gmail: string;
  password: string;
  tasks: Task[];
  events: Event[];
  profilePic: string;
  coverPic: string;
}
