import { Button, Modal, TextInput, Datepicker } from "flowbite-react";
import { useState } from "react";
import "../styles/components/AddTask.css";

const AddTask = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div>
        <Button
          style={{ padding: "0", fontSize: "12px" }}
          onClick={() => setOpen(true)}
        >
          Add task
        </Button>
      </div>
      <Modal show={open} onClose={() => setOpen(false)} size="5xl">
        <Modal.Header>add task</Modal.Header>
        <Modal.Body>
          <div className="space-y-2">
            <p className="flex">
              <strong className="add-task-label">Task Name:</strong>
              <TextInput className="add-task-label-input"/>
            </p>
            <p className="flex ">
              <strong className="add-task-label">Date Started:</strong>
              <Datepicker />
            </p>
            <p className="flex ">
              <strong className="add-task-label">Deadline:</strong>
              <Datepicker />
            </p>
            <p className="flex ">
              <strong className="add-task-label">Status:</strong>
              <TextInput />
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddTask;
