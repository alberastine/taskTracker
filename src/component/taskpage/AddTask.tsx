import {
  Button,
  Modal,
  TextInput,
  Datepicker,
  Select,
  Spinner,
} from "flowbite-react";
import { message } from "antd";
import { useState, useContext } from "react";
import { UserContext } from "@/context/userContext";
import axios from "@/api/axios";
import "@/styles/components/AddTask.css";

const AddTask = () => {
  const { fetchUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const [data, setData] = useState<{
    taskName: string;
    dateStarted: string;
    deadline: string;
    status: string;
  }>({ taskName: "", dateStarted: "", deadline: "", status: "Ongoing" });

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { taskName, dateStarted, deadline, status } = data;

    if (!taskName || !dateStarted || !deadline || !status) {
      setError("Please fill out all fields");
      return;
    }

    const formattedDateStarted = new Date(dateStarted).toISOString();
    const formattedDeadline = new Date(deadline).toISOString();

    const payload = {
      taskName,
      dateStarted: formattedDateStarted,
      deadline: formattedDeadline,
      status,
    };

    setLoading(true);
    setShowSpinner(true);

    const delay = new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      await delay;

      await axios.post("/addTask", payload);

      await fetchUser();

      message.success("Task added successfully");
      setOpen(false);
      setError("");
      setData({
        taskName: "",
        dateStarted: "",
        deadline: "",
        status: "Ongoing",
      });
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
      setShowSpinner(false);
    }
  };

  return (
    <div>
      <div>
        <Button
          style={{ padding: "0", fontSize: "12px" }}
          onClick={() => setOpen(true)}
          className="add-task-button"
        >
          Add task
        </Button>
      </div>

      <Modal show={open} onClose={() => setOpen(false)} size="5xl">
        <Modal.Header>add task</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSave}>
            <div className="space-y-2">
              <div className="flex">
                <strong className="add-task-label">Task Name:</strong>
                <TextInput
                  className="add-task-label-input"
                  value={data.taskName}
                  onChange={(e) =>
                    setData({ ...data, taskName: e.target.value })
                  }
                />
              </div>

              <div className="flex">
                <strong className="add-task-label">Date Started:</strong>
                <Datepicker
                  value={data.dateStarted}
                  onSelectedDateChanged={(date) =>
                    setData({
                      ...data,
                      dateStarted: date.toLocaleDateString("en-CA"),
                    })
                  }
                />
              </div>

              <div className="flex">
                <strong className="add-task-label">Deadline:</strong>
                <Datepicker
                  value={data.deadline}
                  onSelectedDateChanged={(date) =>
                    setData({
                      ...data,
                      deadline: date.toLocaleDateString("en-CA"),
                    })
                  }
                />
              </div>

              <div className="flex">
                <strong className="add-task-label">Status:</strong>
                <Select
                  value={data.status}
                  onChange={(e) => setData({ ...data, status: e.target.value })}
                  required
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Late">Late</option>
                </Select>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <Modal.Footer className="mt-4 flex justify-end">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                style={{ backgroundColor: "rgb(220, 20, 60)", color: "white" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                style={{ display: "flex", alignItems: "center" }}
              >
                Save
                {showSpinner && <Spinner size="sm" className="ml-2" />}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddTask;
