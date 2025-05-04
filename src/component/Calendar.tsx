import { useEffect, useState } from "react";
import { Calendar, Modal, Button, Input, Form, Badge } from "antd";
import dayjs, { Dayjs } from "dayjs";
import axios from "../api/axios";
import WidgetWrapper from "./WidgetWrapper";

interface CalendarEvent {
  _id: string;
  title: string;
  date: string;
}

const TaskCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingEventTitle, setEditingEventTitle] = useState<string>("");

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get("/events");
      setEvents(res.data);
    };
    fetchEvents();
  }, []);

  // Handle date click to open modal
  const onDateClick = (date: Dayjs) => {
    setSelectedDate(date);
    setIsModalVisible(true);
    setEditingEventId(null);
    setEditingEventTitle("");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddEvent = async () => {
    if (!newEventTitle || !selectedDate) return;

    const newEvent = {
      title: newEventTitle,
      date: selectedDate.format("YYYY-MM-DD"),
    };

    try {
      const res = await axios.post("/events", newEvent);
      setEvents((prevEvents) => [...prevEvents, res.data]);
      setNewEventTitle("");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error adding event", error);
    }
  };

  // Edit event
  const handleEditEvent = async () => {
    if (!editingEventTitle || !editingEventId) return;

    const updatedEvent = {
      title: editingEventTitle,
    };

    try {
      const res = await axios.put(`/events/${editingEventId}`, updatedEvent);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === editingEventId
            ? { ...event, title: res.data.title }
            : event,
        ),
      );
      setEditingEventId(null);
      setEditingEventTitle("");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating event", error);
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId: string) => {
    try {
      await axios.delete(`/events/${eventId}`);

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId),
      );
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };

  const getEventsForDate = (date: Dayjs) => {
    return events.filter((event) => dayjs(event.date).isSame(date, "day"));
  };

  const cellRender = (date: Dayjs) => {
    const dayEvents = getEventsForDate(date);
    return (
      <ul>
        {dayEvents.map((event, index) => (
        <li key={event._id || `${event.title}-${index}-${date.format("YYYY-MM-DD")}`}>
            <Badge status="success" text={event.title} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <WidgetWrapper>
      <div className="calendar-main-container">
        <div className="calendar-container">
          <Calendar onSelect={onDateClick} cellRender={cellRender} />
        </div>

        <Modal
          title={`Events on ${selectedDate?.format("MMMM D, YYYY")}`}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>,
            editingEventId ? (
              <Button
                type="primary"
                onClick={handleEditEvent}
                disabled={!editingEventTitle}
              >
                Edit Event
              </Button>
            ) : (
              <Button
                key="submit"
                type="primary"
                onClick={handleAddEvent}
                disabled={!newEventTitle}
                style={{ color: "black" }}
              >
                Add Event
              </Button>
            ),
          ]}
        >
          <Form>
            <Form.Item label="New Event Title">
              <Input
                value={editingEventId ? editingEventTitle : newEventTitle}
                onChange={(e) =>
                  editingEventId
                    ? setEditingEventTitle(e.target.value)
                    : setNewEventTitle(e.target.value)
                }
                placeholder="Enter event title"
              />
            </Form.Item>
          </Form>
          <h4>Existing Events:</h4>
          <ul>
            {getEventsForDate(selectedDate!).map((event, index) => (
              <li key={event._id || `${event.title}-${index}`}>
                <span
                  onClick={() => {
                    handleDeleteEvent(event._id);
                  }}
                >
                  {event.title}
                </span>
                <Button
                  type="link"
                  danger
                  onClick={() => {
                    handleDeleteEvent(event._id);
                  }}
                >
                  Delete
                </Button>
                <Button type="primary" style={{ color: "black" }}>
                  Edit Event
                </Button>
              </li>
            ))}
          </ul>
        </Modal>
      </div>
    </WidgetWrapper>
  );
};

export default TaskCalendar;
