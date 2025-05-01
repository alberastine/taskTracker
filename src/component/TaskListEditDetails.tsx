import { Button, Modal } from "flowbite-react";
import TaskData from "../component/UserData.json";
import { useState } from "react";

interface TaskData {
  id: string;
  taskName: string;
  dateStarted: string;
  deadline: string;
  status: string;
}

interface TaskListEditDetailsProps {
  task: TaskData;
}

const TaskListEditDetails = ({ task }: TaskListEditDetailsProps) => {
  const [openModal, setOpenModal] = useState(false);

  const handleEditClick = () => {
    setOpenModal(true);
  };

  return (
    <div>
        <div>
          <a
            onClick={handleEditClick}
            className="cursor-pointer font-medium text-cyan-600 hover:underline dark:text-cyan-500"
          >
            Edit
          </a>
        </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Task Details</Modal.Header>
        <Modal.Body>
          <div className="space-y-2">
            <p>
              <strong>Task Name:</strong> {task.taskName}
            </p>
            <p>
              <strong>Date Started:</strong> {new Date(task.dateStarted).toLocaleDateString()}
            </p>
            <p>
              <strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button onClick={() => setOpenModal(false)}>Close</Button>
          <Button>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskListEditDetails;
